import { GraphQLString, GraphQLFloat, GraphQLInt } from "graphql";
import ProductType from "../typedefs/productType.js";
import Product from "../../models/Product.js";

const createProduct = {
  type: ProductType,
  args: {
    brand: { type: GraphQLString },
    category: { type: GraphQLString },
    description: { type: GraphQLString },
    discountPercentage: { type: GraphQLFloat },
    images: { type: GraphQLString },
    price: { type: GraphQLFloat },
    rating: { type: GraphQLFloat },
    stock: { type: GraphQLInt },
    thumbnail: { type: GraphQLString },
    title: { type: GraphQLString },
  },
  async resolve(parent, args, req) {
    const newProduct = new Product({
      title: args.title,
      brand: args.brand,
      category: args.category,
      description: args.description,
      discountPercentage: args.discountPercentage,
      images: args.images,
      price: args.price,
      rating: args.rating,
      stock: args.stock,
      thumbnail: args.thumbnail,
    });

    await newProduct.save();

    return newProduct;
  },
};

const updateProduct = {
  type: ProductType,
  args: {
    id: { type: GraphQLString },
    brand: { type: GraphQLString },
    category: { type: GraphQLString },
    description: { type: GraphQLString },
    discountPercentage: { type: GraphQLFloat },
    images: { type: GraphQLString },
    price: { type: GraphQLFloat },
    rating: { type: GraphQLFloat },
    stock: { type: GraphQLInt },
    thumbnail: { type: GraphQLString },
    title: { type: GraphQLString },
  },
  async resolve(parent, args, req) {
    const newProduct = await Product.findByIdAndUpdate(args.id, {
      brand: args.brand,
      category: args.category,
      description: args.description,
      discountPercentage: args.discountPercentage,
      images: args.images,
      price: args.price,
      rating: args.rating,
      stock: args.stock,
      thumbnail: args.thumbnail,
      title: args.title,
    });

    return newProduct;
  },
};

const deleteProduct = {
  type: ProductType,
  args: {
    id: { type: GraphQLString },
  },
  async resolve(parent, args) {
    console.log(args.id);

    await Product.findByIdAndDelete(args.id);

    return args;
  },
};

export { createProduct, updateProduct, deleteProduct };
