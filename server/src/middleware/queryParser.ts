// External Imports
import { RequestHandler, Request, Response, NextFunction } from "express";
import { Op } from "sequelize";

const filterActionMap: { [key: string]: any } = {
  _eq: Op.eq,
  _ne: Op.ne,
  _is: Op.is,
  _not: Op.not,
  _or: Op.or,
  _gt: Op.gt,
  _gte: Op.gte,
  _lt: Op.lt,
  _lte: Op.lte,
  _between: Op.between,
  _notBetween: Op.notBetween,
  _in: Op.in,
  _notIn: Op.notIn,
  _like: Op.like,
  _notLike: Op.notLike,
  _startsWith: Op.startsWith,
  _endsWith: Op.endsWith,
  _substring: Op.substring,
  _iLike: Op.iLike,
  _notILike: Op.notILike,
};

const parseFilter = (filter: any, obj: any = {}) => {
  Object.entries(filter).forEach(([field, value]) => {
    let opCode = field;
    if (Object.keys(filterActionMap).includes(field)) {
      opCode = filterActionMap[field];
    }

    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      obj[opCode] = parseFilter(value, {});
    } else {
      obj[opCode] = value;
    }
  });

  return obj;
};

export const queryParser = (): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
  req.sqlParams = {
    limit: 100,
    offset: 0,
    order: [],
    where: {},
  };

  if (req.query && Object.keys(req.query).length > 0) {
    const { limit, offset, sort_by, filter } = req.query;

    if (limit) {
      req.sqlParams.limit = Number(limit);
    }

    if (offset) {
      req.sqlParams.offset = Number(offset);
    }

    if (sort_by) {
      if (Array.isArray(sort_by)) {
        sort_by.forEach((s: any) => {
          const field = s.slice(1);
          const direction = s.slice(0, 1) === "+" ? "ASC" : s.slice(0, 1) === "-" ? "DESC" : null;
          if (field && direction) {
            req.sqlParams.order.push([field, direction]);
          }
        });
      } else if (typeof sort_by === "string") {
        const field = sort_by.slice(1);
        const direction = sort_by.slice(0, 1) === "+" ? "ASC" : "DESC";
        if (field && direction) {
          req.sqlParams.order = [];
          req.sqlParams.order.push([field, direction]);
        }
      }
    }

    if (filter && Object.keys(filter).length > 0) {
      const filterObj = JSON.parse(filter as string);
      if (Object.keys(filterObj).length > 0) {
        req.sqlParams.where = parseFilter(filterObj, {});
      }
    }
  }

  return next();
};
