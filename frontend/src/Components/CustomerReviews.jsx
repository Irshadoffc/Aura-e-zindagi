import React, { useState } from "react";
import { Star, Upload, X, ChevronDown, ChevronUp, Filter } from "lucide-react";

const CustomerReviewSection = () => {
  const totalReviews = 72;
  const rating = 4.74;
  const ratingsBreakdown = [
    { stars: 5, count: 61 },
    { stars: 4, count: 6 },
    { stars: 3, count: 3 },
    { stars: 2, count: 1 },
    { stars: 1, count: 1 },
  ];

  const reviews = [
    {
      name: "Ayesha Khan",
      date: "2025-07-08",
      rating: 5,
      title: "Amazing product!",
      text: "I loved the quality and fast delivery. The fabric is super comfortable and the stitching is perfect. Will definitely order again!",
      verified: true,
    },
    {
      name: "Ali Raza",
      date: "2025-07-06",
      rating: 4,
      title: "Very good",
      text: "Product was great but packaging could improve. The item itself is high quality and fits well. Delivery was faster than expected.",
      verified: true,
    },
    {
      name: "Sana Mir",
      date: "2025-07-05",
      rating: 3,
      title: "Average experience",
      text: "Not bad, but expected better quality for the price. The color is slightly different from the picture online. It's wearable but not perfect.",
      verified: false,
    },
    {
      name: "Imran Ahmed",
      date: "2025-06-28",
      rating: 5,
      title: "Perfect fit!",
      text: "Exactly what I was looking for. The size was perfect and the material is breathable. Highly recommend!",
      verified: true,
    },
    {
      name: "Fatima Zahra",
      date: "2025-06-25",
      rating: 5,
      title: "Excellent service",
      text: "Great customer service when I had a question about sizing. The product arrived quickly and was exactly as described.",
      verified: true,
    },
  ];

  const [showForm, setShowForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [filteredRating, setFilteredRating] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  const getPercentage = (count) => Math.round((count / totalReviews) * 100);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("rating", selectedRating);
    formData.append("title", title);
    formData.append("review", review);
    formData.append("name", name);
    formData.append("email", email);
    if (file) {
      formData.append("file", file);
    }

    alert("Review submitted (mock)");
    setShowForm(false);
    // Reset form
    setSelectedRating(0);
    setTitle("");
    setReview("");
    setName("");
    setEmail("");
    setFile(null);
  };

  const filteredReviews = filteredRating
    ? reviews.filter((r) => r.rating === filteredRating)
    : reviews;

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOption === "highest") {
      return b.rating - a.rating;
    } else {
      return a.rating - b.rating;
    }
  });

  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 bg-white rounded-2xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <div className="flex items-center mt-2">
            <div className="flex items-center mr-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(rating)
                      ? "fill-[#FFB800] text-[#FFB800]"
                      : i < rating
                      ? "fill-[#FFB800]/50 text-[#FFB800]/50"
                      : "fill-gray-300 text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-900 font-medium">
              {rating.toFixed(1)} · {totalReviews} reviews
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setFilteredRating(null)}
            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 ${
              !filteredRating
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            All
          </button>
          {[5, 4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() =>
                setFilteredRating(filteredRating === stars ? null : stars)
              }
              className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 ${
                filteredRating === stars
                  ? "bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {stars} <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Rating Summary */}
        <div className="lg:col-span-1 bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Rating Breakdown</h3>
          {ratingsBreakdown.map((r) => (
            <div
              key={r.stars}
              className="flex items-center mb-3 cursor-pointer group"
              onClick={() => setFilteredRating(r.stars)}
            >
              <div className="flex w-20 items-center">
                <span className="text-gray-700 w-4">{r.stars}</span>
                <Star className="w-4 h-4 ml-1 fill-[#FFB800] text-[#FFB800]" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 mx-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFB800]"
                  style={{ width: `${getPercentage(r.count)}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-8 text-right">
                {getPercentage(r.count)}%
              </span>
            </div>
          ))}

          <button
            onClick={() => setShowForm(true)}
            className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <Star className="w-5 h-5" />
            Write a Review
          </button>

          <div className="mt-6">
            <h4 className="font-medium mb-2">Sort by</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "newest", label: "Newest" },
                { value: "highest", label: "Highest" },
                { value: "lowest", label: "Lowest" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortOption(option.value)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    sortOption === option.value
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Reviews */}
        <div className="lg:col-span-2">
          {displayedReviews.length > 0 ? (
            <div className="space-y-6">
              {displayedReviews.map((r, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{r.name}</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < r.rating
                                  ? "fill-[#FFB800] text-[#FFB800]"
                                  : "fill-gray-300 text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(r.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        {r.verified && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <h5 className="font-semibold text-gray-900 mt-3">{r.title}</h5>
                  <p className="text-gray-700 mt-2">{r.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No reviews match your selected filter.
              </p>
              <button
                onClick={() => setFilteredRating(null)}
                className="mt-4 text-gray-900 underline hover:text-gray-700"
              >
                Clear filters
              </button>
            </div>
          )}

          {reviews.length > 3 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="inline-flex items-center text-gray-900 font-medium hover:text-gray-700"
              >
                {showAllReviews ? (
                  <>
                    <ChevronUp className="w-5 h-5 mr-1" />
                    Show fewer reviews
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5 mr-1" />
                    Show all {reviews.length} reviews
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Write a Review</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-gray-700 mb-3 font-medium">
                  How would you rate this product?
                </label>
                <div className="flex justify-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setSelectedRating(i + 1)}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="w-12 h-12 flex items-center justify-center"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          i < (hoverRating || selectedRating)
                            ? "fill-[#FFB800] text-[#FFB800]"
                            : "fill-gray-300 text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="title"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Review Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Summarize your experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="review"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Your Review
                </label>
                <textarea
                  id="review"
                  placeholder="Share details about your experience with the product"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent"
                  required
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">
                  Add Photo/Video (Optional)
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 cursor-pointer hover:border-[#FFB800] transition-colors">
                  <Upload className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="text-gray-700 font-medium">
                    Upload Media
                  </span>
                  <span className="text-sm text-gray-500">
                    JPEG, PNG or MP4 (max 10MB)
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept="image/*,video/*"
                  />
                </label>
                {file && (
                  <div className="mt-2 flex items-center text-sm text-gray-700">
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Your Name (Public)
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="How you'll appear"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Your Email (Private)
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="For verification only"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-6">
                By submitting your review, you agree to our privacy policy and
                terms of service. We may use your review for marketing purposes.
              </p>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FFB800] text-white rounded-lg hover:bg-[#E6A500] transition-colors font-medium"
                  disabled={selectedRating === 0}
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReviewSection;