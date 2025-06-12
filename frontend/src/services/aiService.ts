export interface AIGenerationRequest {
  type: 'outline' | 'content' | 'quiz' | 'assignment' | 'summary';
  topic: string;
  context?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  length?: 'short' | 'medium' | 'long';
}

export interface AIGenerationResponse {
  content: string;
  suggestions?: string[];
  metadata?: {
    estimatedTime: number;
    difficulty: string;
    topics: string[];
  };
}

class AIService {
  private apiKey: string | null = null;
  private baseUrl: string = '/api/ai'; // We'll create this API endpoint

  constructor() {
    // In a real app, this would come from environment variables
    this.apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || null;
  }

  async generateContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`AI generation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI generation error:', error);
      // Return mock data for now
      return this.getMockResponse(request);
    }
  }

  async generateOutline(topic: string, context?: string): Promise<AIGenerationResponse> {
    return this.generateContent({
      type: 'outline',
      topic,
      context,
      length: 'medium',
    });
  }

  async generateLessonContent(topic: string, outline?: string): Promise<AIGenerationResponse> {
    return this.generateContent({
      type: 'content',
      topic,
      context: outline,
      length: 'long',
    });
  }

  async generateQuiz(topic: string, content?: string): Promise<AIGenerationResponse> {
    return this.generateContent({
      type: 'quiz',
      topic,
      context: content,
      difficulty: 'intermediate',
    });
  }

  async generateAssignment(topic: string, content?: string): Promise<AIGenerationResponse> {
    return this.generateContent({
      type: 'assignment',
      topic,
      context: content,
      difficulty: 'intermediate',
    });
  }

  async generateSummary(content: string): Promise<AIGenerationResponse> {
    return this.generateContent({
      type: 'summary',
      topic: 'Content Summary',
      context: content,
      length: 'short',
    });
  }

  private getMockResponse(request: AIGenerationRequest): AIGenerationResponse {
    const { type, topic, difficulty = 'intermediate' } = request;

    switch (type) {
      case 'outline':
        return {
          content: `
            <h2>Course Outline: ${topic}</h2>
            <ol>
              <li><strong>Introduction to ${topic}</strong>
                <ul>
                  <li>What is ${topic}?</li>
                  <li>Why is it important?</li>
                  <li>Key concepts overview</li>
                </ul>
              </li>
              <li><strong>Core Fundamentals</strong>
                <ul>
                  <li>Basic principles</li>
                  <li>Essential terminology</li>
                  <li>Foundational concepts</li>
                </ul>
              </li>
              <li><strong>Practical Applications</strong>
                <ul>
                  <li>Real-world examples</li>
                  <li>Case studies</li>
                  <li>Hands-on exercises</li>
                </ul>
              </li>
              <li><strong>Advanced Topics</strong>
                <ul>
                  <li>Complex scenarios</li>
                  <li>Best practices</li>
                  <li>Common pitfalls</li>
                </ul>
              </li>
            </ol>
          `,
          metadata: {
            estimatedTime: 120,
            difficulty,
            topics: [topic],
          },
        };

      case 'content':
        return {
          content: `
            <h1>${topic}</h1>
            <p>Welcome to this comprehensive lesson on ${topic}. In this module, we'll explore the fundamental concepts and practical applications that will help you master this subject.</p>
            
            <h2>What You'll Learn</h2>
            <p>By the end of this lesson, you'll be able to:</p>
            <ul>
              <li>Understand the core principles of ${topic}</li>
              <li>Apply ${topic} concepts in real-world scenarios</li>
              <li>Identify common challenges and solutions</li>
              <li>Develop practical skills through hands-on exercises</li>
            </ul>

            <h2>Key Concepts</h2>
            <p>Let's start by understanding the essential concepts that form the foundation of ${topic}.</p>
            
            <blockquote>
              <p><strong>Important Note:</strong> ${topic} is a fundamental skill that requires both theoretical knowledge and practical experience.</p>
            </blockquote>

            <h3>Practical Example</h3>
            <p>Here's a simple example to illustrate the concept:</p>
            <pre><code>// Example code or demonstration
function demonstrate${topic.replace(/\s+/g, '')}() {
  console.log("This is how ${topic} works in practice");
  return "Success!";
}</code></pre>

            <h2>Next Steps</h2>
            <p>Now that you understand the basics, you're ready to explore more advanced topics and apply your knowledge in practical exercises.</p>
          `,
          metadata: {
            estimatedTime: 45,
            difficulty,
            topics: [topic],
          },
        };

      case 'quiz':
        return {
          content: `
            <h2>Quiz: ${topic}</h2>
            <p>Test your understanding of ${topic} with these questions:</p>
            
            <div class="quiz-question">
              <h3>Question 1</h3>
              <p>What is the primary purpose of ${topic}?</p>
              <ul>
                <li>A) To complicate simple tasks</li>
                <li>B) To solve specific problems efficiently</li>
                <li>C) To increase development time</li>
                <li>D) To confuse developers</li>
              </ul>
              <p><strong>Correct Answer:</strong> B</p>
            </div>

            <div class="quiz-question">
              <h3>Question 2</h3>
              <p>Which of the following is NOT a benefit of ${topic}?</p>
              <ul>
                <li>A) Improved code organization</li>
                <li>B) Better maintainability</li>
                <li>C) Increased complexity</li>
                <li>D) Enhanced readability</li>
              </ul>
              <p><strong>Correct Answer:</strong> C</p>
            </div>

            <div class="quiz-question">
              <h3>Question 3</h3>
              <p>When should you use ${topic}?</p>
              <ul>
                <li>A) Only in complex projects</li>
                <li>B) Only in simple projects</li>
                <li>C) When it provides clear benefits</li>
                <li>D) Never, it's outdated</li>
              </ul>
              <p><strong>Correct Answer:</strong> C</p>
            </div>
          `,
          metadata: {
            estimatedTime: 15,
            difficulty,
            topics: [topic],
          },
        };

      case 'assignment':
        return {
          content: `
            <h2>Assignment: ${topic} Practice</h2>
            <p>Complete this assignment to reinforce your understanding of ${topic}.</p>
            
            <h3>Objective</h3>
            <p>Create a practical implementation that demonstrates your mastery of ${topic} concepts.</p>

            <h3>Requirements</h3>
            <ul>
              <li>Implement a solution using ${topic} principles</li>
              <li>Include proper documentation and comments</li>
              <li>Test your implementation thoroughly</li>
              <li>Submit your code with a brief explanation</li>
            </ul>

            <h3>Submission Guidelines</h3>
            <ol>
              <li>Write clean, well-documented code</li>
              <li>Include test cases for your implementation</li>
              <li>Provide a brief explanation of your approach</li>
              <li>Submit before the deadline</li>
            </ol>

            <h3>Grading Criteria</h3>
            <ul>
              <li>Correctness: 40%</li>
              <li>Code quality: 30%</li>
              <li>Documentation: 20%</li>
              <li>Creativity: 10%</li>
            </ul>
          `,
          metadata: {
            estimatedTime: 60,
            difficulty,
            topics: [topic],
          },
        };

      case 'summary':
        return {
          content: `
            <h2>Summary</h2>
            <p>In this lesson, we covered the essential aspects of ${topic}.</p>
            
            <h3>Key Takeaways</h3>
            <ul>
              <li>Understanding of core ${topic} concepts</li>
              <li>Practical application methods</li>
              <li>Best practices and common pitfalls</li>
              <li>Real-world implementation strategies</li>
            </ul>

            <h3>Next Steps</h3>
            <p>Continue practicing with the exercises and assignments provided. Consider exploring related topics to deepen your understanding.</p>
          `,
          metadata: {
            estimatedTime: 5,
            difficulty: 'beginner',
            topics: [topic],
          },
        };

      default:
        return {
          content: `<p>Generated content for: ${topic}</p>`,
          metadata: {
            estimatedTime: 10,
            difficulty,
            topics: [topic],
          },
        };
    }
  }
}

export const aiService = new AIService(); 