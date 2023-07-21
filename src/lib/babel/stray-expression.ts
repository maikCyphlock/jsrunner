import type { TraverseOptions, Node } from '@babel/traverse';
//TODO: FIX BUG ON SHOWING MATH element thats return always {}
const customMath = {
	abs: () => { },
	acos: () => { },
	acosh: () => { },
	asin: () => { },
	asinh: () => { },
	atan: () => { },
	atanh: () => { },
	atan2: () => { },
	ceil: () => { },
	cbrt: () => { },
	expm1: () => { },
	clz32: () => { },
	cos: () => { },
	cosh: () => { },
	exp: () => { },
	floor: () => { },
	fround: () => { },
	hypot: () => { },
	imul: () => { },
	log: () => { },
	log1p: () => { },
	log2: () => { },
	log10: () => { },
	max: () => { },
	min: () => { },
	pow: () => { },
	random: () => { },
	round: () => { },
	sign: () => { },
	sin: () => { },
	sinh: () => { },
	sqrt: () => { },
	tan: () => { },
	tanh: () => { },
	trunc: () => { },
	E: 2.718281828459045,
	LN10: 2.302585092994046,
	LN2: 0.6931471805599453,
	LOG10E: 0.4342944819032518,
	LOG2E: 1.4426950408889634,
	PI: 3.141592653589793,
	SQRT1_2: 0.7071067811865476,
	SQRT2: 1.4142135623730951,
}

export default function ({ types: t }: any): { visitor: TraverseOptions<Node> } {

	function visit(path: any) {

		if (path.parentPath.node.type !== 'VariableDeclarator') return;
		if (path.parentPath.parentPath.parentPath.node.type !== 'Program') return;
		const variableName = path.parentPath.node.id.name;

		path.parentPath.parentPath.insertAfter(
			t.callExpression(t.identifier('debug'), [
				t.identifier(path.node.loc.start.line.toString()),
				t.identifier(variableName)
			])
		);
	}

	function expression(path: any, replace?: null | undefined) {
		if (replace == null) replace = path.node;

		if (path.parentPath.node.type != 'ExpressionStatement') return;
		if (path.node.callee?.identifier == 'debug') return;


		if (path.parentPath.parentPath?.node?.type == 'WhileStatement') return;
		if (path.parentPath.parentPath?.node?.type == 'ForStatement') return;

		if (path.node.loc?.start == null) return;

		path.replaceWith(
			t.callExpression(t.identifier('debug'), [t.numericLiteral(path.node.loc.start.line), replace])
		)

	}

	return {
		visitor: {
			ConditionalExpression(path) {
				if (path.parentPath.type == 'ExpressionStatement') return
				if (path.parentPath.type == 'VariableDeclarator') return
				if (path.parentPath.type == 'AssignmentExpression') return
				if (path.parentPath.type == 'BlockStatement') return
				if (path.parentPath.type == 'FunctionExpression') return
				if (path.parentPath.type == 'ArrowFunctionExpression') return
				expression(path);
				visit(path);
			},
			BinaryExpression(path) {
				if (path.parentPath.type == 'VariableDeclarator') return
				expression(path);
				visit(path);
			},
			UnaryExpression(path) {
				if (path.parentPath.type == 'VariableDeclarator') return
				expression(path);
				visit(path);
			},
			CallExpression(path) {
				if (path.node.callee['object'] && path.node.callee['object'].name == 'console') return;
				expression(path);
				visit(path);
			},
			AwaitExpression(path) {
				if (path.parentPath.type == 'VariableDeclarator') return
				expression(path);
				visit(path);
			},
			NewExpression(path) {
				if (path.parentPath.type == 'VariableDeclarator') return
				expression(path);
				visit(path);
			},
			DirectiveLiteral(path) {
				if (path.parentPath.type == 'VariableDeclarator') return
				if (!path.node?.value) return;
				if (!path.node.loc?.start?.line) return;
				path.parentPath.replaceWith(
					t.callExpression(t.identifier('debug'), [
						t.numericLiteral(path.node.loc.start.line),
						t.stringLiteral(path.node.value)
					])
				);
			},
			Identifier(path) {
				if (path.parentPath.type == 'VariableDeclarator') return
				if (path.node.name === 'Math') {


				}

				expression(path);
				visit(path);
			},
			ArrayExpression(path) {
				if (path.parentPath.type == 'VariableDeclarator') return
				expression(path);
				visit(path);
			},
			MemberExpression(path) {
				if (path.parentPath.type == 'VariableDeclarator') return
				expression(path);
				visit(path);
			},
			Literal(path) {
				if (path.parentPath.type === 'VariableDeclarator') return
				if (path.type == 'TemplateLiteral') return;
				expression(path);
				visit(path);
			}
		}
	};
}

