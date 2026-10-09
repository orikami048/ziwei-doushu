import { NextRequest } from 'next/server';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { BaZiChart } from '@/lib/bazi/types';
import { detectPatterns, getMingGongSummary } from '@/lib/ziwei/patterns';
import { STAR_DB } from '@/lib/ziwei/db-analysis';
import { generateLocalInterpretation } from '@/lib/ziwei/local-interpret';

export const runtime = 'nodejs';

interface RequestBody {
  chart: ZiweiChart;
  bazi?: BaZiChart;
  messages: { role: 'user' | 'assistant'; content: string }[];
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { chart, bazi, messages } = body;

    if (!chart) {
      return new Response(JSON.stringify({ error: 'Chart data required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const latestMessage = messages[messages.length - 1]?.content ?? '';

    // 如果配置了环境变量 ANTHROPIC_API_KEY，且可以成功调用
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const { default: Anthropic } = await import('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

        const systemPrompt = `你是一位精通倪海夏《天纪》紫微斗数与《子平真诠》《滴天髓》四柱八字体系的顶尖东方命理导师。
你的分析风格：
1. 恪守传统法度，逻辑严谨，每一个论断必须有据可依；
2. 语言现代清晰，不搞封建迷信与铁口直断；
3. 输出严格遵守用户请求中的 Markdown **【标题】** 结构；
4. 命盘数据：
- 命宫：${chart.palaces[chart.mingGongBranch]?.name}，主星：${chart.palaces[chart.mingGongBranch]?.stars.filter(s => s.type === 'major').map(s => s.name).join('、') || '空宫'}
- 身宫：${chart.palaces[chart.shenGongBranch]?.name}
- 五行局：${chart.wuxingJuName}
- 节气四柱：${chart.lunarInfo.fourPillars?.join(' ') ?? '未知'}
${bazi ? `- 八字日主：${bazi.dayMaster.stemCn}${bazi.dayMaster.elementCn}（${bazi.dayMaster.archetypeCn}），五行最旺：${bazi.dominantElements.join('、')}，喜用：${bazi.supportingElements.join('、')}` : ''}
`;

        const stream = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1800,
          temperature: 0.7,
          system: systemPrompt,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          stream: true,
        });

        const readableStream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            try {
              for await (const chunk of stream) {
                if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                  const payload = `data: ${JSON.stringify({ delta: { text: chunk.delta.text } })}\n\n`;
                  controller.enqueue(encoder.encode(payload));
                }
              }
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            } catch (err) {
              controller.error(err);
            }
          },
        });

        return new Response(readableStream, {
          headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
          },
        });
      } catch (e) {
        console.warn('Anthropic API unavailable, falling back to local synthesis engine:', e);
      }
    }

    // ── 本地高精度知识库合成引擎 (Local Synthesis Engine) ──
    const generatedText = generateLocalInterpretation(chart, bazi, latestMessage);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        // 模拟平滑流式推送（每次推送2-5个字符，延迟10ms）
        const chunkSize = 4;
        for (let i = 0; i < generatedText.length; i += chunkSize) {
          const slice = generatedText.slice(i, i + chunkSize);
          const payload = `data: ${JSON.stringify({ delta: { text: slice } })}\n\n`;
          controller.enqueue(encoder.encode(payload));
          await new Promise(r => setTimeout(r, 12));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    console.error('Interpret API error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
