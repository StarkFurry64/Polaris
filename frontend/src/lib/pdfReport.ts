import { jsPDF } from 'jspdf';

interface ReportData {
    repoName: string;
    repoOwner: string;
    generatedBy: string;
    generatedAt: Date;
    metrics: {
        totalCommits: number;
        totalPRs: number;
        openPRs: number;
        mergedPRs: number;
        totalContributors: number;
        totalIssues: number;
        openIssues: number;
        closedIssues: number;
    };
    contributors: Array<{
        name: string;
        commits: number;
        prs: number;
    }>;
    risks: Array<{
        title: string;
        severity: 'high' | 'medium' | 'low';
        description: string;
        impact: string;
    }>;
    recommendations: string[];
    jiraMetrics?: {
        total: number;
        todo: number;
        inProgress: number;
        done: number;
        bugs: number;
    };
}

export const generateExecutiveReport = (data: ReportData): void => {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;

    // Helper functions
    const addNewPage = () => {
        pdf.addPage();
        yPos = margin;
    };

    const checkPageBreak = (neededSpace: number) => {
        if (yPos + neededSpace > pageHeight - margin) {
            addNewPage();
        }
    };

    const drawLine = (y: number) => {
        pdf.setDrawColor(128, 90, 213); // Purple
        pdf.setLineWidth(0.5);
        pdf.line(margin, y, pageWidth - margin, y);
    };

    // ===== HEADER =====
    pdf.setFillColor(10, 10, 15); // Dark background
    pdf.rect(0, 0, pageWidth, 50, 'F');

    // Logo/Title
    pdf.setTextColor(168, 85, 247); // Purple
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('POLARIS', margin, 25);

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Enterprise Intelligence Report', margin, 35);

    // Report metadata (right side)
    pdf.setFontSize(9);
    pdf.setTextColor(180, 180, 180);
    pdf.text(`Generated: ${data.generatedAt.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })}`, pageWidth - margin, 20, { align: 'right' });
    pdf.text(`By: ${data.generatedBy}`, pageWidth - margin, 27, { align: 'right' });
    pdf.text(`Repository: ${data.repoOwner}/${data.repoName}`, pageWidth - margin, 34, { align: 'right' });

    yPos = 60;

    // ===== EXECUTIVE SUMMARY =====
    pdf.setTextColor(168, 85, 247);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Executive Summary', margin, yPos);
    yPos += 8;
    drawLine(yPos);
    yPos += 10;

    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const summary = `This report provides a comprehensive analysis of the ${data.repoName} repository. ` +
        `The project has ${data.metrics.totalContributors} active contributors with ${data.metrics.totalCommits} total commits. ` +
        `There are currently ${data.metrics.openPRs} open pull requests and ${data.metrics.openIssues} open issues requiring attention.`;

    const summaryLines = pdf.splitTextToSize(summary, contentWidth);
    pdf.text(summaryLines, margin, yPos);
    yPos += summaryLines.length * 5 + 10;

    // ===== KEY METRICS =====
    checkPageBreak(60);
    pdf.setTextColor(168, 85, 247);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Performance Metrics', margin, yPos);
    yPos += 8;
    drawLine(yPos);
    yPos += 10;

    // Metrics boxes
    const boxWidth = (contentWidth - 15) / 4;
    const boxHeight = 25;
    const metrics = [
        { label: 'Total Commits', value: data.metrics.totalCommits.toString(), color: [59, 130, 246] },
        { label: 'Open PRs', value: data.metrics.openPRs.toString(), color: [168, 85, 247] },
        { label: 'Contributors', value: data.metrics.totalContributors.toString(), color: [16, 185, 129] },
        { label: 'Open Issues', value: data.metrics.openIssues.toString(), color: [239, 68, 68] }
    ];

    metrics.forEach((metric, i) => {
        const x = margin + (i * (boxWidth + 5));
        pdf.setFillColor(245, 245, 250);
        pdf.roundedRect(x, yPos, boxWidth, boxHeight, 3, 3, 'F');

        pdf.setTextColor(metric.color[0], metric.color[1], metric.color[2]);
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text(metric.value, x + boxWidth / 2, yPos + 12, { align: 'center' });

        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(metric.label, x + boxWidth / 2, yPos + 20, { align: 'center' });
    });
    yPos += boxHeight + 15;

    // ===== JIRA METRICS (if available) =====
    if (data.jiraMetrics) {
        checkPageBreak(50);
        pdf.setTextColor(168, 85, 247);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Jira Project Status', margin, yPos);
        yPos += 8;

        const jiraMetrics = [
            { label: 'Total Issues', value: data.jiraMetrics.total, color: [100, 100, 100] },
            { label: 'To Do', value: data.jiraMetrics.todo, color: [148, 163, 184] },
            { label: 'In Progress', value: data.jiraMetrics.inProgress, color: [59, 130, 246] },
            { label: 'Done', value: data.jiraMetrics.done, color: [16, 185, 129] },
            { label: 'Bugs', value: data.jiraMetrics.bugs, color: [239, 68, 68] }
        ];

        const jiraBoxWidth = (contentWidth - 20) / 5;
        jiraMetrics.forEach((metric, i) => {
            const x = margin + (i * (jiraBoxWidth + 5));
            pdf.setFillColor(250, 250, 252);
            pdf.roundedRect(x, yPos, jiraBoxWidth, 20, 2, 2, 'F');

            pdf.setTextColor(metric.color[0], metric.color[1], metric.color[2]);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text(metric.value.toString(), x + jiraBoxWidth / 2, yPos + 10, { align: 'center' });

            pdf.setTextColor(120, 120, 120);
            pdf.setFontSize(7);
            pdf.text(metric.label, x + jiraBoxWidth / 2, yPos + 16, { align: 'center' });
        });
        yPos += 30;
    }

    // ===== TOP CONTRIBUTORS =====
    checkPageBreak(60);
    pdf.setTextColor(168, 85, 247);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Top Contributors', margin, yPos);
    yPos += 8;
    drawLine(yPos);
    yPos += 8;

    // Table header
    pdf.setFillColor(245, 245, 250);
    pdf.rect(margin, yPos, contentWidth, 8, 'F');
    pdf.setTextColor(80, 80, 80);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Rank', margin + 5, yPos + 6);
    pdf.text('Contributor', margin + 25, yPos + 6);
    pdf.text('Commits', margin + 100, yPos + 6);
    pdf.text('Pull Requests', margin + 130, yPos + 6);
    yPos += 10;

    // Table rows
    pdf.setFont('helvetica', 'normal');
    data.contributors.slice(0, 5).forEach((contributor, i) => {
        pdf.setTextColor(60, 60, 60);
        pdf.text((i + 1).toString(), margin + 5, yPos + 5);
        pdf.text(contributor.name, margin + 25, yPos + 5);
        pdf.text(contributor.commits.toString(), margin + 100, yPos + 5);
        pdf.text(contributor.prs.toString(), margin + 130, yPos + 5);

        if (i < data.contributors.length - 1) {
            pdf.setDrawColor(230, 230, 230);
            pdf.line(margin, yPos + 7, pageWidth - margin, yPos + 7);
        }
        yPos += 8;
    });
    yPos += 10;

    // ===== RISK ANALYSIS =====
    checkPageBreak(80);
    pdf.setTextColor(168, 85, 247);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Risk Analysis', margin, yPos);
    yPos += 8;
    drawLine(yPos);
    yPos += 10;

    if (data.risks.length === 0) {
        pdf.setTextColor(16, 185, 129);
        pdf.setFontSize(11);
        pdf.text('✓ No significant risks detected at this time.', margin, yPos);
        yPos += 15;
    } else {
        data.risks.slice(0, 4).forEach((risk) => {
            checkPageBreak(25);

            // Risk severity badge
            const severityColors: Record<string, number[]> = {
                high: [239, 68, 68],
                medium: [245, 158, 11],
                low: [59, 130, 246]
            };
            const color = severityColors[risk.severity] || severityColors.low;

            pdf.setFillColor(color[0], color[1], color[2]);
            pdf.roundedRect(margin, yPos, 18, 6, 1, 1, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'bold');
            pdf.text(risk.severity.toUpperCase(), margin + 9, yPos + 4, { align: 'center' });

            // Risk title
            pdf.setTextColor(40, 40, 40);
            pdf.setFontSize(11);
            pdf.text(risk.title, margin + 22, yPos + 5);
            yPos += 10;

            // Risk description
            pdf.setTextColor(80, 80, 80);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            const descLines = pdf.splitTextToSize(risk.description, contentWidth - 5);
            pdf.text(descLines, margin + 5, yPos);
            yPos += descLines.length * 4 + 8;
        });
    }

    // ===== RECOMMENDATIONS =====
    checkPageBreak(60);
    pdf.setTextColor(168, 85, 247);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Recommendations', margin, yPos);
    yPos += 8;
    drawLine(yPos);
    yPos += 10;

    data.recommendations.slice(0, 5).forEach((rec, i) => {
        checkPageBreak(15);
        pdf.setFillColor(16, 185, 129);
        pdf.circle(margin + 3, yPos - 1, 2, 'F');

        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const recLines = pdf.splitTextToSize(rec, contentWidth - 10);
        pdf.text(recLines, margin + 10, yPos);
        yPos += recLines.length * 5 + 5;
    });

    // ===== FOOTER =====
    const footerY = pageHeight - 15;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(8);
    pdf.text('Generated by Polaris Enterprise Intelligence', margin, footerY);
    pdf.text(`Page 1`, pageWidth - margin, footerY, { align: 'right' });

    // Save the PDF
    const fileName = `polaris-executive-report-${data.repoName}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
};
