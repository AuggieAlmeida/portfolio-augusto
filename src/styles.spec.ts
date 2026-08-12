/**
 * O Karma não deixa forçar `prefers-reduced-motion`, então o teste lê a regra
 * no CSSOM em vez de observar o efeito. É o suficiente para o que interessa:
 * a regra existir, valer para a página inteira e encurtar a animação em vez de
 * removê-la — `animation: none` deixaria a trajetória parada em `opacity-0`.
 */
describe('prefers-reduced-motion global', () => {
  const reducedMotionRules = (): CSSStyleRule[] => {
    const found: CSSStyleRule[] = [];

    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue; // folha de outra origem
      }

      for (const rule of Array.from(rules)) {
        if (!(rule instanceof CSSMediaRule)) continue;
        if (!rule.conditionText.includes('prefers-reduced-motion')) continue;
        found.push(
          ...(Array.from(rule.cssRules).filter(
            (inner) => inner instanceof CSSStyleRule
          ) as CSSStyleRule[])
        );
      }
    }

    return found;
  };

  it('covers the whole page, not only the sections that already treated the case', () => {
    const universal = reducedMotionRules().find(
      (rule) => rule.selectorText.split(',')[0].trim() === '*'
    );

    expect(universal)
      .withContext('nenhuma regra universal sob prefers-reduced-motion')
      .toBeDefined();
  });

  it('shortens the animation instead of removing it, so nothing stays at opacity 0', () => {
    const universal = reducedMotionRules().find(
      (rule) => rule.selectorText.split(',')[0].trim() === '*'
    )!;

    expect(universal.style.animationDuration).toBeTruthy();
    expect(universal.style.animationDuration).not.toBe('0s');
    expect(universal.style.animationIterationCount).toBe('1');
    expect(universal.style.getPropertyPriority('animation-duration')).toBe('important');
  });

  it('also stops the hover transforms, which are movement even when instant', () => {
    const hover = reducedMotionRules().filter((rule) => rule.selectorText.includes(':hover'));
    const covered = hover.flatMap((rule) => rule.selectorText.split(',').map((s) => s.trim()));

    expect(covered).toContain('.roadmap-card:hover');
    expect(covered).toContain('.skill-tag:hover');
    expect(hover.every((rule) => rule.style.transform === 'none')).toBeTrue();
  });
});
