"use client";

import React, { useState } from "react";
import TopNavBar from "@/components/TopNavBar";

const TABS = [
  { id: "convertible-bonds", label: "可转债", icon: "🔄" },
  { id: "a-shares", label: "A股基础", icon: "📊", comingSoon: true },
  { id: "etf-cn", label: "ETF/LOF", icon: "📦", comingSoon: true },
  { id: "ipo", label: "打新", icon: "🎯", comingSoon: true },
];

export default function ChinaMarketPage() {
  const [activeTab, setActiveTab] = useState("convertible-bonds");

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900/95 dark:to-blue-950/10">
      <TopNavBar features={{}} />

      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar */}
        <aside className="w-56 border-r border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              🇨🇳 A股市场
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              China Market Products
            </p>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.comingSoon && setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    : tab.comingSoon
                    ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.comingSoon && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400">
                    soon
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-gray-100 dark:border-gray-800">
            <a
              href="/"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
            >
              ← 返回主页
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === "convertible-bonds" && <ConvertibleBondsContent />}
        </main>
      </div>
    </div>
  );
}

function ConvertibleBondsContent() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          中国可转债 (Convertible Bonds)
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          产品说明与投资建议 · 适用市场：中国A股可转债市场（沪深交易所）
        </p>
      </div>

      {/* TLDR Card */}
      <div className="mb-8 p-5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
          TL;DR
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
          可转债 = 一张<strong>低息企业债</strong> + 一份<strong>免费看涨期权</strong>。
          下有债底保护（到期还本付息），上跟正股涨幅（转股获利）。它是A股市场中
          <strong>唯一同时具备 T+0 交易、无涨跌幅限制、且散户可零门槛打新</strong>的品种。
        </p>
      </div>

      {/* Section 1: Product Nature */}
      <Section title="1. 产品本质" id="nature">
        <Table
          headers={["维度", "说明"]}
          rows={[
            ["发行人", "上市公司（需证监会审批）"],
            ["面值", "100 元/张"],
            ["期限", "通常 6 年"],
            ["票面利率", "极低（第一年 0.2%~0.5%，逐年递增，到期年化约 1.5%~2.5%）"],
            ["转股期", "发行后 6 个月起可转股"],
            ["交易方式", "T+0，沪深交易所竞价交易"],
            ["涨跌幅", "上市首日不设限制，次日起 ±20%（沪市）/±30%（深市创业板）"],
          ]}
        />
        <Note>
          为什么利率这么低？因为投资者拿到了一份隐含的看涨期权。公司用低融资成本换取未来可能的股权稀释。
        </Note>
      </Section>

      {/* Section 2: Core Terms */}
      <Section title="2. 核心条款" id="terms">
        <SubSection title="2.1 转股价">
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>初始转股价 ≈ 发行时正股价格（通常溢价 0~5%）</li>
            <li>每张可转债可转股数 = 100 ÷ 转股价</li>
            <li>例：转股价 10 元 → 每张可转 10 股</li>
          </ul>
        </SubSection>

        <SubSection title="2.2 强制赎回条款（最重要）">
          <Callout type="warning">
            正股连续 30 个交易日中有 15 天收盘价 ≥ 转股价 × 130%
          </Callout>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-3">
            触发后公司有权以 <strong>100 + 当期利息</strong>（约 100.5 元）强制赎回。
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300 mt-2">
            <li>如果你以 100 元买入、转债涨到 130+ → 盈利 30%+</li>
            <li>如果你不操作 → 公司用 ~100 元赎回你 130 元市价的债 → <span className="text-red-600 dark:text-red-400 font-bold">巨亏</span></li>
          </ul>
          <Callout type="danger">
            强赎公告后必须卖出或转股，绝不能躺平。每年都有投资者因此亏损 20%+。
          </Callout>
        </SubSection>

        <SubSection title="2.3 下修转股价条款">
          <Callout type="info">
            正股连续 30 个交易日中有 15 天收盘价 ≤ 转股价 × 85%
          </Callout>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-3">
            公司<strong>可以（非必须）</strong>提议下修转股价，需经股东大会 2/3 通过。
            下修 = 降低转股门槛 = 期权重新变成平值 → 利好可转债价格。
          </p>
          <Note>
            公司为什么愿意下修？因为如果投资者转股，公司就不用还钱了。转股 = 免费融资。
          </Note>
        </SubSection>

        <SubSection title="2.4 回售条款">
          <Callout type="info">
            正股连续 30 个交易日收盘价 ≤ 转股价 × 70%
          </Callout>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-3">
            投资者有权按 100 + 当期利息 把债卖回给公司。这是投资者的最后保护网。
          </p>
        </SubSection>
      </Section>

      {/* Section 3: Price Structure */}
      <Section title="3. 价格构成" id="price">
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
          可转债价格 = 纯债价值 + 期权价值
        </div>
        <Table
          headers={["价格区间", "状态", "驱动因素"]}
          rows={[
            ["90~105", "债性为主", "跟随信用债定价，正股已跌穿转股价"],
            ["105~130", "债股混合", "正股上涨则转债跟涨，下跌则有债底托举"],
            ["130~200+", "股性为主", "几乎完全跟随正股波动，丧失债底保护"],
          ]}
        />
        <SubSection title="关键指标">
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>
              <strong>转股溢价率</strong> = (转债价格 - 转股价值) ÷ 转股价值 × 100%
              <br />
              <span className="text-gray-500 text-xs">低溢价（&lt;5%）→ 弹性大；高溢价（&gt;30%）→ 弹性小</span>
            </li>
            <li>
              <strong>到期收益率 (YTM)</strong> = 持有到期不转股的年化收益率
              <br />
              <span className="text-gray-500 text-xs">YTM &gt; 0 → 即使正股归零，持有到期也不亏（前提：公司不违约）</span>
            </li>
          </ul>
        </SubSection>
      </Section>

      {/* Section 4: Strategies */}
      <Section title="4. 投资策略" id="strategies">
        <SubSection title="4.1 打新策略（最稳健）">
          <StrategyCard
            operation="新债申购 → 中签 → 上市首日卖出"
            returns="2020-2024 年均首日收益约 10~25%，破发率约 5%~15%"
            risk="极低"
            suitability="所有投资者"
          />
        </SubSection>
        <SubSection title="4.2 双低策略（进阶）">
          <StrategyCard
            operation="双低值 = 转债价格 + 转股溢价率×100 < 130，买入10-20只等权持有，每月轮动"
            returns="历史年化约 15%~25%"
            risk="中低（需排除 ST 正股）"
            suitability="有半年经验的投资者"
          />
        </SubSection>
        <SubSection title="4.3 强赎博弈策略">
          <StrategyCard
            operation="买入低价、临近回售期的转债 → 赌公司下修 → 价格回升"
            returns="每次下修事件通常 5~15% 涨幅"
            risk="中等（公司可能选择还钱不下修）"
            suitability="理解条款博弈的投资者"
          />
        </SubSection>
        <SubSection title="4.4 T+0 轮动策略">
          <StrategyCard
            operation="正股有催化剂时买入对应低溢价转债，当日卖出"
            returns="取决于交易能力"
            risk="中高（需要盯盘）"
            suitability="活跃交易者"
          />
        </SubSection>
      </Section>

      {/* Section 5: Risks */}
      <Section title="5. 风险清单" id="risks">
        <Table
          headers={["风险类型", "严重程度", "说明"]}
          rows={[
            ["信用风险", "⚠️ 高", "2022年搜特转债违约打破刚兑信仰。低评级需警惕"],
            ["强赎不卖", "🔴 致命", "不及时操作，130元市价的债被100元赎回"],
            ["高价追入", "⚠️ 高", "200+元买入已无债底保护，等于买高溢价股票"],
            ["流动性风险", "⚡ 中", "小盘转债日成交额可能<100万"],
            ["利率风险", "⚡ 低", "加息周期中纯债价值下降"],
          ]}
        />
      </Section>

      {/* Section 6: Recommendations */}
      <Section title="6. 分级建议" id="recommendations">
        <div className="space-y-4">
          <RecommendationCard
            level="新手"
            emoji="🌱"
            dos={[
              "只做打新，不做二级市场",
              "每只新债顶格申购",
              "上市首日卖出，不贪",
            ]}
            donts={["不要追高价转债"]}
          />
          <RecommendationCard
            level="进阶"
            emoji="📈"
            dos={[
              "学习双低策略，分散持有 10-20 只",
              "关注 YTM > 0 的品种",
              "排除 ST 正股、AA- 以下评级",
              "设置强赎提醒",
            ]}
            donts={["不要重仓单只转债（>10%）"]}
          />
          <RecommendationCard
            level="高手"
            emoji="🎯"
            dos={[
              "回测双低/低溢价轮动策略",
              "关注下修博弈（回售期前 1-3 月）",
              "利用 T+0 日内套利",
              "监控信用风险指标",
            ]}
            donts={["不要忽视黑天鹅（违约事件）"]}
          />
        </div>
      </Section>

      {/* Section 7: Comparison */}
      <Section title="7. 产品对比" id="comparison">
        <Table
          headers={["维度", "可转债", "股票", "纯债", "期权"]}
          rows={[
            ["最大亏损", "有限（债底）", "可跌至0", "有限（到期还本）", "全部权利金"],
            ["上涨空间", "跟随正股", "无限", "固定利息", "无限"],
            ["交易制度", "T+0", "T+1", "T+0/T+1", "T+0"],
            ["门槛", "无", "无", "无", "50万+考试"],
            ["适合人群", "保守偏进取", "激进", "保守", "专业"],
          ]}
        />
      </Section>

      {/* Section 8: Data Sources */}
      <Section title="8. 数据源" id="datasources">
        <Table
          headers={["数据", "来源"]}
          rows={[
            ["实时行情/条款", "集思录 (jisilu.cn)、宁稳网"],
            ["强赎/下修公告", "巨潮资讯网 (cninfo.com.cn)"],
            ["评级信息", "中证鹏元、联合资信"],
            ["回测数据", "集思录历史数据、通达信/同花顺"],
            ["可转债日历", "东方财富可转债频道"],
          ]}
        />
      </Section>

      {/* Footer */}
      <div className="mt-12 mb-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          本文仅用于产品说明与投资教育，不构成具体投资建议。市场有风险，投资需谨慎。
        </p>
      </div>
    </div>
  );
}

// ─── Reusable Components ────────────────────────────────────────────────────

function Section({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-3 py-2 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic pl-3 border-l-2 border-gray-300 dark:border-gray-600">
      {children}
    </div>
  );
}

function Callout({ type, children }: { type: "info" | "warning" | "danger"; children: React.ReactNode }) {
  const styles = {
    info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    warning: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200",
    danger: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
  };
  return (
    <div className={`text-xs p-3 rounded-lg border ${styles[type]} font-mono`}>
      {children}
    </div>
  );
}

function StrategyCard({
  operation,
  returns,
  risk,
  suitability,
}: {
  operation: string;
  returns: string;
  risk: string;
  suitability: string;
}) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-2">
      <div className="flex items-start gap-2">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-14 shrink-0">操作</span>
        <span className="text-sm text-gray-800 dark:text-gray-200">{operation}</span>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-14 shrink-0">收益</span>
        <span className="text-sm text-green-700 dark:text-green-400">{returns}</span>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-14 shrink-0">风险</span>
        <span className="text-sm text-gray-700 dark:text-gray-300">{risk}</span>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-14 shrink-0">适合</span>
        <span className="text-sm text-gray-700 dark:text-gray-300">{suitability}</span>
      </div>
    </div>
  );
}

function RecommendationCard({
  level,
  emoji,
  dos,
  donts,
}: {
  level: string;
  emoji: string;
  dos: string[];
  donts: string[];
}) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span>{emoji}</span> {level}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {dos.map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 mb-1">
              <span className="text-green-600 dark:text-green-400 shrink-0">✓</span>
              <span>{d}</span>
            </div>
          ))}
        </div>
        <div>
          {donts.map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 mb-1">
              <span className="text-red-500 dark:text-red-400 shrink-0">✗</span>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
