// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String },
//     category: { type: String, required: true },
//     price: { type: Number, required: true },
//     offerPrice: { type: Number },
//     images: { type: [String] }, // array of Cloudinary URLs
// }, { timestamps: true });

// export default mongoose.model('Product', productSchema);


// server/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number },
  images: { type: [String] }, // array of Cloudinary URLs
  inStock: { type: Boolean, default: true },        // NEW
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // NEW
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
