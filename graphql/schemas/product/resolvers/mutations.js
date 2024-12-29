import Product from "../../../../models/Product.js";

const mutations = {
  addProduct: async (_, { input }) => {
    try {
      const existingProduct = await Product.findOne({ title: input.title });
      if (existingProduct) {
        throw new Error("Product with the same title already exists");
      }
      const newProduct = new Product(input);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error("Failed to add product: " + error.message);
    }
  },

  updateProduct: async (_, { id, input }) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
      });
      if (!updatedProduct) throw new Error("Product not found");
      return updatedProduct;
    } catch (error) {
      throw new Error("Failed to update product: " + error.message);
    }
  },

  deleteProduct: async (_, { id }) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) throw new Error("Product not found");
      return true;
    } catch (error) {
      throw new Error("Failed to delete product: " + error.message);
    }
  },
};

export default mutations;
