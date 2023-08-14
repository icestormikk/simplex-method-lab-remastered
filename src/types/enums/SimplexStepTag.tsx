/* eslint-disable @typescript-eslint/no-explicit-any */
import { AiFillTags, AiFillWarning } from 'react-icons/ai'
import { ImCheckmark } from 'react-icons/im';

export abstract class SimplexStepTag {
  protected constructor(
    readonly message: string,
    public icon: React.ReactNode = <AiFillTags/>,
  ) {}
}

export class ArtificialSimplexStartTag extends SimplexStepTag {
  constructor() {
      super("Начался этап вычисления искусственного базиса");
  }
}
export class ArtificialSimplexEndTag extends SimplexStepTag {
  constructor() {
      super("Закончился этап вычисления искусственного базиса");
  }
}
export class DefaultSimplexStartTag extends SimplexStepTag {
  constructor() {
      super("Начался этап применения симплекс-метода");
  }
}
export class DefaultSimplexEndTag extends SimplexStepTag {
  constructor() {
      super("Начался этап применения симплекс-метода");
  }
}
export class HasResultTag extends SimplexStepTag {
  constructor() {
    super("Вычисления завершены");
    this.icon = <ImCheckmark/>
  }
}
export class HasErrorTag extends SimplexStepTag {
  public readonly content: any;

  constructor(reason?: string, content?: any) {
    super(
      "Вычисления остановлены по " + (reason ? `причине: ${reason}` : "неизвестной причине")
    );
    this.icon = <AiFillWarning/>
    this.content = content
  }
}