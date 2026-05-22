export function HomeReviews() {
  const reviews = [
    { name: "Rafiq Hasan", text: "Best drone shop in Bangladesh! Got my DJI Mini 4 Pro at a great price.", rating: 5 },
    { name: "Nadia Islam", text: "Excellent service and fast delivery. Highly recommended!", rating: 5 },
    { name: "Tanvir Ahmed", text: "Great collection of drones and accessories. Very helpful staff.", rating: 5 },
    { name: "Sadia Rahman", text: "Ordered online, delivered next day. Amazing experience!", rating: 5 },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
        <p className="mt-1 text-gray-500">Trusted by drone enthusiasts across Bangladesh</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reviews.map((review, i) => (
          <div key={i} className="rounded-2xl border bg-white p-6">
            <div className="mb-3 flex">
              {Array.from({ length: 5 }).map((_, j) => (
                <svg
                  key={j}
                  className={`h-4 w-4 ${j < review.rating ? "text-yellow-400" : "text-gray-200"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="mb-3 text-sm text-gray-600">&ldquo;{review.text}&rdquo;</p>
            <p className="text-sm font-medium text-gray-900">{review.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
