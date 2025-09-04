import { Parser } from "expr-eval";

type Vars = Record<string, number>;

export function evalPrice(expression: string, vars: Vars) {
	const parser = new Parser({ allowMemberAccess: false });
	const expr = parser.parse(expression);
	// 入力値のサニタイズ
	const sanitized: Vars = {};
	for (const key of Object.keys(vars)) {
		const raw = Number(vars[key]);
		sanitized[key] = Number.isFinite(raw) ? Math.max(0, Math.min(raw, 9_999_999)) : 0;
	}
	const result = expr.evaluate(sanitized);
	return Math.max(0, Math.round(result as number));
}


