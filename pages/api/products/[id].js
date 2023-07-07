import Product from '../../../db/models/Product';


export default async function handler(request, response) {
  const { id } = request.query;

  if (request.method === "PUT") {
    await Product.findByIdAndUpdate(id, { $set: request.body });
    return response.status(200).json({ status: `Product ${id} updated!` });
  } else if (request.method === "GET") {
    const product = await Product.findById(id).populate("reviews");
  
    if (!product) {
      return response.status(404).json({ status: "Not Found" });
    }

    return response.status(200).json(product);
  } else if (request.method === "DELETE") {
    await Product.findByIdAndDelete(id);
    return response.status(200).json({ status: `Product ${id} deleted!` });
  } else {
    return response.status(405).json({ status: "Method Not Allowed" });
  }
}
