import { CardFooter } from "@/components/ui/card";
import Link from "next/link";
export default function Footer() {
  return (
    <CardFooter className="flex flex-col space-y-2 text-center">
      <p className="text-xs">Thank you for using our service.</p>
      <div className="text-xs">
        <p>
          Developed with 🍵 by{" "}
          <Link
            href="https://github.com/AbidAlWassie"
            target="_blank"
            className="font-bold"
          >
            Abid Al Wassie
          </Link>
          .
        </p>
        <p>© 2024 Notesap. All rights reserved.</p>
      </div>
    </CardFooter>
  );
}
