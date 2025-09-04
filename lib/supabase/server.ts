import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClient = async () => {
	const store = await cookies();
	return createServerClient(supabaseUrl, supabaseKey, {
		cookies: {
			getAll() {
				return store.getAll();
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) => store.set(name, value, options));
				} catch {
					// Server Component 環境での setAll 例外は無視（middleware 等でセッション更新を行う想定）
				}
			},
		},
	});
};


