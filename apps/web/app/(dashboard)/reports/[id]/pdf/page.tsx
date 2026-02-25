import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PdfPage({ params }: Props) {
  const { id } = await params;
  // Redirect to the API route which returns the PDF as a download
  redirect(`/api/reports/${id}/pdf`);
}
