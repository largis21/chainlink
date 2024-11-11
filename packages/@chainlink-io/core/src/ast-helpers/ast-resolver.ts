class ResolverStep {
  constructor(
    public readonly type: string,
    public readonly args: string[],
  ) {}

  toString(): string {
    return `${this.type}-${this.args.join(",")}`;
  }

  static fromString(str: string): ResolverStep {
    const [type, argsStr] = str.split("-");
    const args = argsStr ? argsStr.split(",") : [];
    return new ResolverStep(type, args);
  }
}

class ASTResolver {
  private steps: ResolverStep[] = [];

  export(name: string): ASTResolver {
    this.steps.push(new ResolverStep("export", [name]));
    return this;
  }

  resolveUntil(nodeTypes: NodeType[]): ASTResolver {
    this.steps.push(new ResolverStep("resolveUntil", nodeTypes));
    return this;
  }
}

const resolver = new AstResolver().export("default");
