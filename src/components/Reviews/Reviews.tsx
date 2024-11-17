import React, { useState } from 'react';
import { ReviewSummary } from './ReviewSummary';
import { ReviewList } from './ReviewList';
import { ReviewModal } from './ReviewModal';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { uploadToCloudinary } from '../../services/cloudinary';

interface Review {
  _id: string;
  user: {
    name: string;
    image?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
  photos?: string[];
}

interface ReviewsProps {
  productId: string;
  reviews: Review[];
  onReviewAdded: () => void;
}

export function Reviews({ productId, reviews, onReviewAdded }: ReviewsProps) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;

  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating as keyof typeof acc]++;
    return acc;
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  const handleSubmitReview = async (data: { rating: number; comment: string; photos: File[] }) => {
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    setLoading(true);
    try {
      // Upload photos first
      const photoUrls = await Promise.all(
        data.photos.map(photo => uploadToCloudinary(photo))
      );

      // Submit review with photo URLs
      await api.post(`/products/${productId}/reviews`, {
        rating: data.rating,
        comment: data.comment,
        photos: photoUrls
      });

      toast.success('Review submitted successfully');
      setIsModalOpen(false);
      onReviewAdded();
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    if (!user) {
      toast.error('Please login to mark reviews as helpful');
      return;
    }

    try {
      await api.post(`/products/${productId}/reviews/${reviewId}/helpful`);
      onReviewAdded();
    } catch (error) {
      toast.error('Failed to mark review as helpful');
    }
  };

  const handleReport = async (reviewId: string) => {
    if (!user) {
      toast.error('Please login to report reviews');
      return;
    }

    try {
      await api.post(`/products/${productId}/reviews/${reviewId}/report`);
      toast.success('Review reported successfully');
    } catch (error) {
      toast.error('Failed to report review');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Write a Review
        </button>
      </div>

      <ReviewSummary
        averageRating={averageRating}
        totalReviews={reviews.length}
        ratingDistribution={ratingDistribution}
      />

      <ReviewList
        reviews={reviews}
        onHelpful={handleHelpful}
        onReport={handleReport}
      />

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitReview}
        loading={loading}
      />
    </div>
  );
}