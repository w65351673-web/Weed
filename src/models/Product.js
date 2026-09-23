import mongoose from "mongoose";

const SizeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: ["powder"], required: true, default: "powder" },
    strainType: { type: String, enum: ["indica", "sativa", "hybrid", ""], default: "" },
    grade: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    specifications: [{ type: String }],
    sizes: [SizeSchema],
    inStock: { type: Boolean, default: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

// Clear cached model to pick up schema changes
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}
export default mongoose.model("Product", ProductSchema);
