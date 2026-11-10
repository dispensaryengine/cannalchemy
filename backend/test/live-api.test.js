const test = require('node:test');
const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const base = process.env.TEST_BASE_URL;

test('MySQL accounts, isolated progress, recipes, full progression, and login persistence', { skip: !base }, async () => {
  async function api(path, { token, body, status = 200 } = {}) {
    const response = await fetch(`${base}/api${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const data = await response.json();
    assert.equal(response.status, status, `${path}: ${data.error?.message || response.status}`);
    return data;
  }
  assert.equal((await api('/health')).database, 'mysql');
  const strains = (await api('/strains')).strains;
  const recipes = (await api('/recipes')).recipes;
  assert.equal(strains.length, 44);
  assert.equal(recipes.length, 61);
  assert.ok((await api('/strains?search=Afghani')).strains.some(s => s.id === 'afghani'));
  await api('/auth/me', { status: 401 });
  await api('/recipes/validate', { body: { parent1_id: 'afghani', parent2_id: 'thai' }, status: 401 });
  const guest = await api('/auth/guest', { body: {} });
  const other = await api('/auth/guest', { body: {} });
  assert.notEqual(guest.user.id, other.user.id);
  const initial = (await api('/discoveries', { token: guest.token })).discoveries;
  assert.equal(initial.length, 8);
  await api('/recipes/validate', { token: guest.token, body: { parent1_id: 'gelato', parent2_id: 'runtz' }, status: 403 });
  const first = await api('/recipes/validate', { token: guest.token, body: { parent1_id: 'thai', parent2_id: 'afghani' } });
  assert.equal(first.offspring.id, 'northern-lights');
  assert.equal(first.isNew, true);
  const repeat = await api('/recipes/validate', { token: guest.token, body: { parent1_id: 'afghani', parent2_id: 'thai' } });
  assert.equal(repeat.isNew, false);
  assert.equal(repeat.combos_count, 2);
  assert.equal((await api('/discoveries', { token: other.token })).discoveries.length, 8);
  const owned = new Set([...initial.map(d => d.strain_id), first.offspring.id]);
  let prior;
  do {
    prior = owned.size;
    for (const recipe of recipes) {
      if (!owned.has(recipe.offspring_id) && owned.has(recipe.parent1_id) && owned.has(recipe.parent2_id)) {
        const result = await api('/recipes/validate', { token: guest.token, body: { parent1_id: recipe.parent2_id, parent2_id: recipe.parent1_id } });
        assert.equal(result.valid, true);
        owned.add(result.offspring.id);
      }
    }
  } while (prior !== owned.size);
  assert.equal(owned.size, 44, 'all catalog strains must be discoverable');
  assert.equal((await api('/discoveries', { token: guest.token })).discoveries.length, 44);
  const username = `test_${randomBytes(6).toString('hex')}`;
  const password = randomBytes(20).toString('hex');
  const account = await api('/auth/signup', { body: { username, password } });
  await api('/auth/signup', { body: { username, password }, status: 409 });
  await api('/auth/login', { body: { username, password: 'incorrect' }, status: 401 });
  await api('/recipes/validate', { token: account.token, body: { parent1_id: 'afghani', parent2_id: 'thai' } });
  const login = await api('/auth/login', { body: { username: username.toUpperCase(), password } });
  assert.equal(login.user.id, account.user.id);
  assert.equal(login.user.combos_count, 1);
  assert.equal((await api('/discoveries', { token: login.token })).discoveries.length, 9);
  assert.equal((await api('/auth/me', { token: login.token })).user.id, account.user.id);
});
