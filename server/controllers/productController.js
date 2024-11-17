import Product from '../models/Product.js';

// Get all reviews (admin)
export const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: 'reviews.user',
        select: 'name email image'
      });

    const reviews = products.reduce((allReviews, product) => {
      const productReviews = product.reviews.map(review => ({
        ...review.toObject(),
        product: {
          _id: product._id,
          name: product.name,
          images: product.images
        }
      }));
      return [...allReviews, ...productReviews];
    }, []);

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const products = await Product.find(query)
      .populate('category')
      .populate('relatedProducts')
      .populate({
        path: 'reviews.user',
        select: 'name email image'
      })
      .sort({ isFeatured: -1, order: 1, createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.json([]);
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('category')
    .select('name price images category')
    .limit(12)
    .sort('-createdAt');

    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Failed to search products' });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('relatedProducts')
      .populate({
        path: 'reviews.user',
        select: 'name email image'
      });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      order: req.body.isFeatured ? await Product.countDocuments({ isFeatured: true }) : 0
    });
    
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('category')
    .populate('relatedProducts');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update related products
export const updateRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { relatedProducts: req.body.relatedProducts },
      { new: true }
    ).populate('relatedProducts');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error updating related products:', error);
    res.status(400).json({ message: error.message });
  }
};

// Reorder featured products
export const reorderFeaturedProducts = async (req, res) => {
  try {
    const { products } = req.body;
    await Promise.all(
      products.map(({ id, order }) => 
        Product.findByIdAndUpdate(id, { order })
      )
    );
    res.json({ message: 'Featured products reordered successfully' });
  } catch (error) {
    console.error('Error reordering featured products:', error);
    res.status(500).json({ message: 'Failed to reorder featured products' });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add review
export const addReview = async (req, res) => {
  try {
    const { rating, comment, photos } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      user: req.user._id,
      rating,
      comment,
      photos: photos || [],
      verified: true,
      createdAt: new Date()
    };

    product.reviews.push(review);

    // Update average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();
    
    // Populate user info before sending response
    const populatedProduct = await Product.findById(product._id)
      .populate({
        path: 'reviews.user',
        select: 'name email image'
      });

    const addedReview = populatedProduct.reviews[populatedProduct.reviews.length - 1];
    
    res.status(201).json(addedReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(400).json({ message: error.message });
  }
};

// Mark review as helpful
export const markReviewHelpful = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.helpful = (review.helpful || 0) + 1;
    await product.save();
    
    res.json(review);
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    res.status(400).json({ message: error.message });
  }
};

// Report review
export const reportReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.reported = true;
    await product.save();
    
    res.json({ message: 'Review reported successfully' });
  } catch (error) {
    console.error('Error reporting review:', error);
    res.status(400).json({ message: error.message });
  }
};

// Verify review (admin)
export const verifyReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.verified = true;
    await product.save();
    
    res.json(review);
  } catch (error) {
    console.error('Error verifying review:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete review (admin)
export const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.remove();
    
    // Update average rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      product.rating = totalRating / product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(400).json({ message: error.message });
  }
};