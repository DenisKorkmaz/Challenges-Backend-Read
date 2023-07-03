import dbConnect from '../../../db/connect';
import Product from '../../../db/models/Product';
import Review from "../../../db/models/Review"

export default async function handler(request, response) {
  const { id } = request.query;

  const product = await Product.findById(id).populate("reviews");
  
  if (!product) {
    return response.status(404).json({ status: "Not Found" });
  }

  response.status(200).json(product);
}
