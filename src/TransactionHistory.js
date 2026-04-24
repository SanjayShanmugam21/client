import { useContext, useEffect, useState } from "react";
import { Table, Container, Card, Form, Button, Row, Col, Pagination } from "react-bootstrap";
import UserContext from "./context";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function TransactionHistory() {
    const { user, setUser } = useContext(UserContext);
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchLatestData = async () => {
            try {
                const res = await axios.get('https://servers-z5cm.onrender.com/api/users/profile');
                setUser(res.data);
            } catch (err) {
                console.error("Error fetching latest transactions:", err);
            }
        };
        if (user) fetchLatestData();
    }, []);

    if (!user) return <Container className="mt-5"><h3>Please login to view your transaction history.</h3></Container>;

    const filteredTransactions = user.transactions ? user.transactions.filter(tx => {
        if (selectedMonth === "all") return true;
        const txMonth = new Date(tx.date).getMonth().toString();
        return txMonth === selectedMonth;
    }) : [];

    // Calculate chart data (Cumulative balance trend)
    const sortedTxForChart = [...(user.transactions || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
    let runningBalance = 0;
    const chartLabels = sortedTxForChart.map(tx => new Date(tx.date).toLocaleDateString());
    const chartDataValues = sortedTxForChart.map(tx => {
        if (tx.type === 'deposit') runningBalance += tx.amount;
        else runningBalance -= tx.amount;
        return runningBalance;
    });

    const chartData = {
        labels: chartLabels.length > 0 ? chartLabels : ["Start"],
        datasets: [
            {
                label: 'Balance Trend (₹)',
                data: chartDataValues.length > 0 ? chartDataValues : [0],
                fill: true,
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderColor: '#3498db',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#3498db',
                pointHoverRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#2c3e50',
                padding: 12,
                titleFont: { size: 14 },
                bodyFont: { size: 14 },
                displayColors: false
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            y: { grid: { borderDash: [5, 5] }, ticks: { font: { size: 10 } } }
        }
    };

    const totalIncome = filteredTransactions
        ?.filter(tx => tx.type === 'deposit')
        .reduce((sum, tx) => sum + tx.amount, 0) || 0;

    const totalExpense = filteredTransactions
        ?.filter(tx => tx.type === 'withdraw')
        .reduce((sum, tx) => sum + tx.amount, 0) || 0;

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = filteredTransactions.slice().reverse().slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const handleDownload = () => {
        const headers = ["Date", "Type", "Amount", "Status"];
        const rows = filteredTransactions.slice().reverse().map(tx => [
            new Date(tx.date).toLocaleString(),
            tx.type.toUpperCase(),
            tx.amount,
            "COMPLETED"
        ]);

        let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Statement_${selectedMonth === 'all' ? 'All' : 'Month_' + (parseInt(selectedMonth) + 1)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <Container className="mt-3">
            <div className="tracking-summary-container">
                <div className="stat-widget">
                    <span className="stat-widget-label">Total Deposits</span>
                    <span className="stat-widget-value value-income">₹{totalIncome.toLocaleString()}</span>
                </div>
                <div className="stat-widget">
                    <span className="stat-widget-label">Total Withdrawals</span>
                    <span className="stat-widget-value value-expense">₹{totalExpense.toLocaleString()}</span>
                </div>
                <div className="stat-widget" style={{ borderLeft: "4px solid #3498db" }}>
                    <span className="stat-widget-label">Net Balance</span>
                    <span className="stat-widget-value value-balance">₹{user.amount.toLocaleString()}</span>
                </div>
            </div>

            <Card className="shadow-lg tracking-card mb-4">
                <Card.Header className="bg-white border-0 py-3 px-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                        <div>
                            <h5 className="fw-bold mb-0 text-dark">Account Activity</h5>
                            <p className="text-muted mb-0 small text-uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>Visual analytics for {user.name}</p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <Form.Select
                                size="sm"
                                style={{ width: "130px", fontSize: '0.75rem' }}
                                value={selectedMonth}
                                onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
                                className="shadow-sm"
                            >
                                <option value="all">All Months</option>
                                {months.map((month, index) => (
                                    <option key={index} value={index}>{month}</option>
                                ))}
                            </Form.Select>
                            <Button variant="outline-primary" size="sm" className="shadow-sm py-1 px-3 small" style={{ fontSize: '0.75rem' }} onClick={handleDownload}>
                                <i className="bi bi-download me-2"></i> Download
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="px-4 pb-3 pt-0">
                    <Row className="g-3">
                        <Col lg={7}>
                            <h6 className="fw-bold text-secondary mb-2 small text-uppercase" style={{ fontSize: '0.7rem' }}>Transaction History</h6>
                            <Table hover striped responsive className="history-table mb-2 border">
                                <thead className="table-light">
                                    <tr style={{ fontSize: '0.7rem' }}>
                                        <th className="py-1">Date</th>
                                        <th className="py-1">Type</th>
                                        <th className="text-end py-1">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTransactions.length > 0 ? (
                                        currentTransactions.map((tx, index) => (
                                            <tr key={index}>
                                                <td className="align-middle py-1">
                                                    <div className="fw-bold text-dark" style={{ fontSize: '0.75rem' }}>{new Date(tx.date).toLocaleDateString()}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.65rem' }}>{new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td className="align-middle py-1">
                                                    <span className={`badge ${tx.type === 'deposit' ? 'bg-success' : 'bg-danger'} rounded-pill px-2 py-0 small`} style={{ fontSize: '0.65rem' }}>
                                                        {tx.type.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="text-end align-middle py-1">
                                                    <span className={`fw-bold ${tx.type === 'deposit' ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.75rem' }}>
                                                        {tx.type === 'deposit' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="py-4 text-center text-muted small">
                                                No activity in this period.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <div className="text-muted fw-bold" style={{ fontSize: '0.7rem' }}>
                                        Page {currentPage} / ({totalPages})
                                    </div>
                                    <Pagination className="mb-0 custom-pagination pagination-sm">
                                        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                                        {[...Array(totalPages)].map((_, i) => (
                                            <Pagination.Item
                                                key={i + 1}
                                                active={i + 1 === currentPage}
                                                onClick={() => setCurrentPage(i + 1)}
                                            >
                                                {i + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                                    </Pagination>
                                </div>
                            )}
                        </Col>
                        <Col lg={5}>
                            <h6 className="fw-bold text-secondary mb-2 small text-uppercase text-center" style={{ fontSize: '0.7rem' }}>Balance Trend</h6>
                            <div className="p-2 bg-light rounded-3 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.05)", height: "180px" }}>
                                <Line data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                            </div>
                            <div className="mt-3 p-2 border rounded-3 bg-white text-center">
                                <span className="text-muted d-block fw-bold" style={{ fontSize: '0.65rem' }}>INSIGHT</span>
                                <p className="text-secondary mb-0 mt-1 italic" style={{ fontSize: '0.7rem' }}>
                                    Your net worth has {chartDataValues[chartDataValues.length - 1] > chartDataValues[0] ? 'increased' : 'decreased'} over recorded history.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}
