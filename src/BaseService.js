const CustomError = require("./utils/CustomError");

class BaseService {
  constructor({ model, referenceFields = [] }) {
    this.model = model;
    this.referenceFields = referenceFields;
  }

  getPaginationOptions({ query, user, exclude = [] }) {
    const myCustomLabels = {
      docs: "data",
    };

    const options = {
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 15,
      filter: query.filter,
      sort: query.sort,
      select: query.select,
      populate: this.getPopulateString(),
      customLabels: myCustomLabels,
    };

    // Return the options object
    return options;
  }

  getPopulateString() {
    if (this.referenceFields.length > 0) {
      // Loop through the reference fields and call the populate method on the query object with each field's fieldName and modelName
      const array = [];
      for (const field of this.referenceFields) {
        // Check if there is a nestedFieldPath property
        if (field.nestedPath) {
          // Use dot notation to specify the path to the nested field
          array.push(`${field.fieldName}.${field.nestedPath}`);
        } else {
          array.push(`${field.fieldName}`);
          // Use the fieldName as the paths
        }
      }
      return array;
    }
    return "";
  }

  async createOne(data) {
    try {
      const doc = new this.model(data);
      await doc.save();
      return doc;
    } catch (error) {
      throw error;
    }
  }

  async createMany(dataArray) {
    try {
      return await this.model.insertMany(dataArray);
    } catch (error) {
      throw error;
    }
  }

  async getOne(id) {
    try {
      let query = this.model.findById(id);
      const populateString = this.getPopulateString();
      if (populateString) {
        query = query.populate(populateString);
      }
      const doc = await query;
      if (!doc) throw new CustomError(404, `${this.model.modelName} not found`);
      return doc;
    } catch (error) {
      throw error;
    }
  }

  async getAll(query, user) {
    try {
      const options = this.getPaginationOptions({ query, user });
      return await this.model.paginate(options.filter, options);
    } catch (error) {
      throw error;
    }
  }

  async updateOne(id, data) {
    try {
      // Fetch the existing document
      let doc = await this.model.findById(id);
      if (!doc) throw new CustomError(404, `${this.model.modelName} not found`);

      // Apply the updates from `data` to the document
      Object.keys(data).forEach((key) => {
        doc[key] = data[key];
      });

      // Save the updated document
      await doc.save();

      // If population is needed
      if (this.getPopulateString()) {
        doc = await doc.populate(this.getPopulateString()).execPopulate();
      }

      return doc;
    } catch (error) {
      throw error;
    }
  }

  async updateMany(filter, data) {
    try {
      return await this.model.updateMany(filter, data);
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(id) {
    try {
      const doc = await this.model.findByIdAndDelete(id);
      if (!doc) throw new CustomError(404, `${this.model.modelName} not found`);
      return doc;
    } catch (error) {
      throw error;
    }
  }

  async deleteMany(filter) {
    try {
      return await this.model.deleteMany(filter);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BaseService;
