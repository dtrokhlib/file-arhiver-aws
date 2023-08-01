import { injectable } from 'inversify';
import { IQuery } from 'src/interfaces/api/IQuery';

const filterKeys: string[] = ['offset', 'limit', 'orderBy', 'orderType'];

@injectable()
export class BaseController {
  getFilters(query: IQuery) {
    const filters = {};

    Object.entries(query).forEach(([key, value]) => {
      if (filterKeys.includes(key)) {
        Object.assign(filters, { [key]: value });
      }
    });

    return filters;
  }

  getSearch(query: IQuery) {
    const search = {};

    Object.entries(query).forEach(([key, value]) => {
      if (!filterKeys.includes(key)) {
        Object.assign(search, { [key]: value });
      }
    });

    return search;
  }
}
