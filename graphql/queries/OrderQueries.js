import { GraphQLList, GraphQLString } from "graphql";
import Order from "../../models/Order.js";
import OrderType from "../typedefs/orderType.js";

const getAllOrders = {
  type: new GraphQLList(OrderType),
  args: { id: { type: GraphQLString } },
  async resolve(_, args, req) {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    const orderList = await Order.find({ userId: args.id });
    return orderList;
  },
};

export { getAllOrders };
