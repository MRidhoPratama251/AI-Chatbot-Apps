import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface TokenUsageChartProps {
  data: Array<{ date: string; tokens: number }>;
  from?: string;
  to?: string;
  onRangeChange?: (from: string, to: string) => void;
}

export function TokenUsageChart({ data }: TokenUsageChartProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.date);
    if (startDate && itemDate < startDate) return false;
    if (endDate && itemDate > endDate) return false;
    return true;
  });

  const totalTokens = filteredData.reduce((sum, item) => sum + item.tokens, 0);
  const averageTokens = filteredData.length 
    ? Math.round(totalTokens / filteredData.length)
    : 0;
  const maxTokens = Math.max(...filteredData.map(item => item.tokens), 0);

  const pieData = [
    { name: 'Used', value: totalTokens, fill: 'hsl(var(--primary))' },
    { name: 'Remaining', value: Math.max(10000 - totalTokens, 0), fill: 'hsl(var(--muted))' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Token Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label>From Date</Label>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>
            <div>
              <Label>To Date</Label>
              <DatePicker date={endDate} setDate={setEndDate} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">
                  {totalTokens.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Total Tokens</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {averageTokens.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Daily Average</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-orange-600">
                  {maxTokens.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Daily Maximum</p>
              </CardContent>
            </Card>
          </div>

          <div className="h-[300px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="tokens" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Usage Distribution</h4>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Usage Insights</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Peak usage day:</span>
                  <span className="font-medium">
                    {filteredData.length > 0 
                      ? filteredData.reduce((max, item) => 
                          item.tokens > max.tokens ? item : max, filteredData[0]
                        ).date
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Usage trend:</span>
                  <span className="font-medium text-green-600">
                    {totalTokens > 0 ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Days tracked:</span>
                  <span className="font-medium">{filteredData.length}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}