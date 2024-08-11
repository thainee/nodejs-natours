class APIFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    const newQueryObj = { ...this.queryObj };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete newQueryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(newQueryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(',').join(' ');
      this.query.select(fields);
    } else {
      this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryObj.page * 1 || 1;
    const limit = this.queryObj.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
