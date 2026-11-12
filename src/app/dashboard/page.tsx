import Image from "next/image";
import { verifySession } from "../lib/auth/dal";
import { getUserByUsername } from "../lib/users";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const { username } = await verifySession();
    const user = await getUserByUsername(username);

    if (!user) {
        redirect("/login");
    }

    return (
    <main className="gradient-border flex min-w-half flex-col items-center justify-center gap-4 bg-white p-2 pb-10 m-5 rounded-4xl max-w-md shadow-xl">
        <Image
        src="/logo.png"
        alt="Logo"
        width={300}
        height={300}
        loading="eager"
        />
        hi {user.displayName}!
    </main>
    );
}
