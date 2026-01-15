type IOptions = {
  page?: number | string;
  limit?: number | string;
  skip?: number | string;
  orderBy?: string;
  order?: string;
};

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  orderBy: string;
  order: string;
};

const paginationSortingHelper = (options: IOptions): IOptionsResult => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const orderBy = options.orderBy || "createdAt";
  const order = options.order || "desc";

  return {
    page,
    limit,
    skip,
    orderBy,
    order,
  };
};

export default paginationSortingHelper;
