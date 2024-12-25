import { GraphQLList, GraphQLString } from "graphql";
import ProductType from "../typedefs/productType.js";
import Product from "../../models/Product.js";

const getAllProduct = {
  type: new GraphQLList(ProductType),
  async resolve() {
    return await Product.find();
  },
};

const getProduct = {
  type: ProductType,
  args: {
    id: { type: GraphQLString },
  },
  async resolve(_, args) {
    return await Product.findById(args.id);
  },
};

export { getAllProduct, getProduct };
