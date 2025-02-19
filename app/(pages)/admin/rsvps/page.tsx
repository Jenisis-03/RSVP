import { signOut } from "@/app/actions/auth";
import { getRSVPs } from "@/app/actions/getRSVPs";
import { RSVPTable } from "@/app/components/RSVPTables";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default async function RSVPsPage() {
  // ✅ Call the function correctly
  const { success, data, message } = await getRSVPs();

  if (!success) {
    return <div className="container mx-auto mt-8 p-4">Error:{message}</div>;
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">RSVPs</h1>
        <div className="flex items-center">
          <Link href={"/"}>
            <Button variant="outline" className="ml-4">
              <HomeIcon />
            </Button>
          </Link>
          <form action={signOut}>
            <Button variant={"outline"}>Sign Out</Button>
          </form>
        </div>
      </div>
      {/* ✅ Ensure correct data structure */}
      <RSVPTable data={data || []} />
    </div>
  );
}
