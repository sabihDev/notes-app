type Params = Promise<{ slug: string }>;

export default async function ViewNote({ params }: { params: Params }) {
  // Await the params Promise to access its properties
    const data = await params;
    const slug = data.slug

  return (
    <div>
      <h1>View Note</h1>
      <p className="text-red-500">{slug}</p>
    </div>
  );
}
