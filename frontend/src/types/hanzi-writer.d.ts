declare module 'hanzi-writer' {
  interface HanziWriterOptions {
    width?: number;
    height?: number;
    padding?: number;
    strokeColor?: string;
    radicalColor?: string;
    outlineColor?: string;
    drawingColor?: string;
    drawingWidth?: number;
    showCharacter?: boolean;
    showOutline?: boolean;
    showHint?: boolean;
  }

  interface AnimationOptions {
    onComplete?: () => void;
  }

  interface HanziWriter {
    animateCharacter(options?: AnimationOptions): void;
    pauseAnimation(): void;
    hideCharacter(): void;
    showCharacter(): void;
  }

  interface HanziWriterStatic {
    create(
      element: HTMLElement,
      character: string,
      options?: HanziWriterOptions
    ): HanziWriter;
  }

  const HanziWriter: HanziWriterStatic;
  export default HanziWriter;
}


