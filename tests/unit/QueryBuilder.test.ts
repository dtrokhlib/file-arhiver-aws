import 'reflect-metadata';
import { QueryBuilder } from '../../src/db/utils/QueryBuilder';
import { QueryType } from '../../src/interfaces/db/QueryType';
import { OrderType } from '../../src/interfaces/db/OrderType';

describe('Query Builder', () => {
  test('Build Select query', () => {
    const queryBuilder = new QueryBuilder();
    const queryString = queryBuilder.buildQuery({
      table: 'some-table-name',
      type: QueryType.SELECT,
      search: {
        name: 'search-this-name',
        age: '25',
      },
      filters: {
        limit: '1',
        orderBy: 'name',
        orderType: OrderType.ASC,
        offset: '10',
      },
    });

    expect(queryString).toBe(
      "SELECT * FROM some-table-name WHERE name='search-this-name' AND age='25' ORDER BY name ASC LIMIT 1 OFFSET 10",
    );
  });

  test('Build Insert query', () => {
    const queryBuilder = new QueryBuilder();
    const queryString = queryBuilder.buildQuery({
      table: 'some-table-name',
      type: QueryType.INSERT,
      payload: {
        someField: 2,
        anotherField: 'hello',
        exludeMeFromReturning: 'http',
      },
    });

    expect(queryString).toBe(
      'INSERT INTO some-table-name (someField, anotherField, exludeMeFromReturning) values ($1, $2, $3) RETURNING *',
    );
  });

  test('Build Update query', () => {
    const queryBuilder = new QueryBuilder();
    const queryString = queryBuilder.buildQuery({
      table: 'some-table-name',
      type: QueryType.UPDATE,
      payload: {
        exclude: 'http',
        test: '1',
      },
      search: { id: '1' },
      excludeReturnFields: ['exclude'],
    });

    expect(queryString).toBe("UPDATE some-table-name SET exclude = $1, test = $2 WHERE id='1' RETURNING test");
  });

  test('Build Delete query', () => {
    const queryBuilder = new QueryBuilder();
    const queryString = queryBuilder.buildQuery({
      table: 'some-table-name',
      type: QueryType.DELETE,
      search: { id: '1' },
    });

    expect(queryString).toBe("DELETE FROM some-table-name WHERE id='1'");
  });

  test('Build Select with empty search query', () => {
    const queryBuilder = new QueryBuilder();
    const queryString = queryBuilder.buildQuery({
      table: 'some-table-name',
      type: QueryType.SELECT,
      filters: {
        orderBy: 'name',
        orderType: OrderType.DESC,
      },
    });

    expect(queryString).toBe('SELECT * FROM some-table-name ORDER BY name DESC');
  });

  test('Build Select with empty search query', () => {
    const queryBuilder = new QueryBuilder();
    const queryString = queryBuilder.buildQuery({
      table: 'some-table-name',
      type: QueryType.SELECT,
    });

    expect(queryString).toBe('SELECT * FROM some-table-name');
  });
});
