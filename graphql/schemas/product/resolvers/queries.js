import Product from "../../../../models/Product.js";

const queries = {
  getProduct: async (_, { id }) => {
    try {
      const product = await Product.findById(id);
      if (!product) throw new Error("Product not found");
      return product;
    } catch (error) {
      throw new Error("Failed to fetch product: " + error.message);
    }
  },

  getProducts: async () => {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      throw new Error("Failed to fetch products: " + error.message);
    }
  },
};

export default queries;
