import { AgentsCompletionsService } from './agents.completions';

describe('AgentsCompletionsService — extractTextFromLLMResponse', () => {
  const extractText = (result: any): string => {
    // @ts-expect-error - accessing private static for testing
    return AgentsCompletionsService.extractTextFromLLMResponse(result);
  };

  it('should extract text from string content', () => {
    const result = extractText({ content: 'Hello world' });
    expect(result).toBe('Hello world');
  });

  it('should extract text from array content with text part', () => {
    const result = extractText({
      content: [{ type: 'text', text: 'Hello from array' }],
    });
    expect(result).toBe('Hello from array');
  });

  it('should return empty string from array without text part', () => {
    const result = extractText({
      content: [{ type: 'tool-call', toolName: 'x' }],
    });
    expect(result).toBe('');
  });

  it('should return empty string from empty array', () => {
    const result = extractText({ content: [] });
    expect(result).toBe('');
  });

  it('should handle mixed content with text at different positions', () => {
    const result = extractText({
      content: [
        { type: 'tool-call', toolName: 'x' },
        { type: 'text', text: 'Second item' },
        { type: 'tool-call', toolName: 'y' },
      ],
    });
    expect(result).toBe('Second item');
  });
});
