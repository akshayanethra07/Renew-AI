import { useEffect, useState } from "react";
import axios from "axios";
import {
  Activity,
  Users,
  Brain,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  Sparkles,
  Search,
} from "lucide-react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/api";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  // ============================================================
  // PREDICTION FORM
  // ============================================================

  const [formData, setFormData] = useState({
    age: "",
    gender: "Male",
    tenure: "",
    monthly_charges: "",
    support_calls: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // CUSTOMER DATA
  // ============================================================

  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ============================================================
  // PREDICTION HISTORY
  // ============================================================

  const [predictions, setPredictions] = useState([]);
  const [predictionsLoading, setPredictionsLoading] = useState(false);
  const [predictionSearch, setPredictionSearch] = useState("");

  // ============================================================
  // FETCH CUSTOMERS
  // ============================================================

  const fetchCustomers = async () => {
    try {
      setCustomersLoading(true);

      const response = await axios.get(
        `${API_URL}/customers/`
      );

      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setCustomersLoading(false);
    }
  };

  // ============================================================
  // FETCH PREDICTIONS
  // ============================================================

  const fetchPredictions = async () => {
    try {
      setPredictionsLoading(true);

      const response = await axios.get(
        `${API_URL}/predictions/`
      );

      setPredictions(response.data);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      setPredictionsLoading(false);
    }
  };

  // ============================================================
  // INITIAL DATA LOAD
  // ============================================================

  useEffect(() => {
    fetchCustomers();
    fetchPredictions();
  }, []);

  // ============================================================
  // LOAD DATA WHEN PAGE CHANGES
  // ============================================================

  useEffect(() => {
    if (activePage === "customers") {
      fetchCustomers();
    }

    if (
      activePage === "predictions" ||
      activePage === "analytics"
    ) {
      fetchPredictions();
    }
  }, [activePage]);

  // ============================================================
  // FORM HANDLING
  // ============================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ============================================================
  // PREDICTION
  // ============================================================

  const handlePredict = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        `${API_URL}/predict/`,
        {
          age: Number(formData.age),
          gender: formData.gender,
          tenure: Number(formData.tenure),
          monthly_charges: Number(
            formData.monthly_charges
          ),
          support_calls: Number(
            formData.support_calls
          ),
        }
      );

      setResult(response.data);

      // Refresh all data
      await fetchCustomers();
      await fetchPredictions();

    } catch (error) {
      console.error(error);

      alert(
        "Unable to connect to the Django backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // DASHBOARD / ANALYTICS CALCULATIONS
  // ============================================================

  const totalCustomers = customers.length;

  const totalPredictions = predictions.length;

  const renewedCustomers = predictions.filter(
    (item) => item.prediction === 1
  ).length;

  const atRiskCustomers = predictions.filter(
    (item) => item.prediction === 0
  ).length;

  const renewalRate =
    totalPredictions > 0
      ? Math.round(
          (renewedCustomers / totalPredictions) * 100
        )
      : 0;

  const atRiskRate =
    totalPredictions > 0
      ? Math.round(
          (atRiskCustomers / totalPredictions) * 100
        )
      : 0;

  const averageProbability =
    totalPredictions > 0
      ? (
          predictions.reduce(
            (sum, item) =>
              sum +
              Number(item.renewal_probability),
            0
          ) / totalPredictions
        ).toFixed(2)
      : "0.00";

  const highProbability = predictions.filter(
    (item) =>
      Number(item.renewal_probability) >= 70
  ).length;

  const mediumProbability = predictions.filter(
    (item) =>
      Number(item.renewal_probability) >= 40 &&
      Number(item.renewal_probability) < 70
  ).length;

  const lowProbability = predictions.filter(
    (item) =>
      Number(item.renewal_probability) < 40
  ).length;

  // ============================================================
  // FILTER CUSTOMERS
  // ============================================================

  const filteredCustomers = customers.filter(
    (customer) => {
      const search =
        searchTerm.toLowerCase();

      return (
        String(customer.customer_id).includes(search) ||
        customer.gender
          ?.toLowerCase()
          .includes(search) ||
        customer.status
          ?.toLowerCase()
          .includes(search)
      );
    }
  );

  // ============================================================
  // FILTER PREDICTIONS
  // ============================================================

  const filteredPredictions = predictions.filter(
    (item) => {
      const search =
        predictionSearch.toLowerCase();

      return (
        String(item.prediction_id).includes(search) ||
        String(item.customer_id).includes(search) ||
        item.gender
          ?.toLowerCase()
          .includes(search) ||
        item.status
          ?.toLowerCase()
          .includes(search)
      );
    }
  );

  // ============================================================
  // NAVIGATION
  // ============================================================

  const handleNavigation = (page) => {
    setActivePage(page);
  };

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="app">

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            <Brain size={24} />
          </div>

          <div>
            <h2>RenewAI</h2>
            <span>Prediction System</span>
          </div>

        </div>


        <nav>

          <a
            className={
              activePage === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation("dashboard")
            }
          >
            <Activity size={19} />
            Dashboard
          </a>


          <a
            className={
              activePage === "customers"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation("customers")
            }
          >
            <Users size={19} />
            Customers
          </a>


          <a
            className={
              activePage === "analytics"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation("analytics")
            }
          >
            <TrendingUp size={19} />
            Analytics
          </a>


          <a
            className={
              activePage === "predictions"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation("predictions")
            }
          >
            <UserCheck size={19} />
            Predictions
          </a>

        </nav>


        <div className="sidebar-bottom">

          <div className="model-status">

            <span className="status-dot"></span>

            <div>
              <strong>Model Online</strong>
              <small>Logistic Regression</small>
            </div>

          </div>

        </div>

      </aside>


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="main-content">

        {/* ====================================================
            DASHBOARD
        ==================================================== */}

        {activePage === "dashboard" && (
          <>

            <header className="topbar">

              <div>

                <p className="eyebrow">
                  AI CUSTOMER INTELLIGENCE
                </p>

                <h1>
                  Subscription Renewal Dashboard
                </h1>

                <p className="subtitle">
                  Predict customer renewal probability
                  using machine learning.
                </p>

              </div>


              <div className="ai-badge">
                <Sparkles size={17} />
                AI Powered
              </div>

            </header>


            {/* Dashboard Statistics */}

            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon blue">
                  <Users size={22} />
                </div>

                <div>
                  <span>Total Customers</span>
                  <h2>
                    {totalCustomers}
                  </h2>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon green">
                  <UserCheck size={22} />
                </div>

                <div>
                  <span>Renewal Rate</span>
                  <h2>
                    {renewalRate}%
                  </h2>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon orange">
                  <AlertTriangle size={22} />
                </div>

                <div>
                  <span>At Risk</span>
                  <h2>
                    {atRiskRate}%
                  </h2>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon purple">
                  <Brain size={22} />
                </div>

                <div>
                  <span>Model Accuracy</span>
                  <h2>
                    84%
                  </h2>
                </div>

              </div>

            </section>


            {/* Prediction Section */}

            <section className="prediction-layout">

              {/* Prediction Form */}

              <div className="prediction-card">

                <div className="section-heading">

                  <div>

                    <h2>
                      Customer Renewal Prediction
                    </h2>

                    <p>
                      Enter customer information to
                      predict subscription renewal.
                    </p>

                  </div>

                </div>


                <form onSubmit={handlePredict}>

                  <div className="form-grid">

                    {/* Age */}

                    <div className="form-group">

                      <label>Age</label>

                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="e.g. 25"
                        min="18"
                        max="100"
                        required
                      />

                    </div>


                    {/* Gender */}

                    <div className="form-group">

                      <label>Gender</label>

                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >

                        <option value="Male">
                          Male
                        </option>

                        <option value="Female">
                          Female
                        </option>

                      </select>

                    </div>


                    {/* Tenure */}

                    <div className="form-group">

                      <label>
                        Tenure (Months)
                      </label>

                      <input
                        type="number"
                        name="tenure"
                        value={formData.tenure}
                        onChange={handleChange}
                        placeholder="e.g. 12"
                        min="1"
                        max="24"
                        required
                      />

                    </div>


                    {/* Monthly Charges */}

                    <div className="form-group">

                      <label>
                        Monthly Charges ($)
                      </label>

                      <input
                        type="number"
                        step="0.01"
                        name="monthly_charges"
                        value={
                          formData.monthly_charges
                        }
                        onChange={handleChange}
                        placeholder="e.g. 59.99"
                        min="0"
                        required
                      />

                    </div>


                    {/* Support Calls */}

                    <div className="form-group full-width">

                      <label>
                        Customer Support Calls
                      </label>

                      <input
                        type="number"
                        name="support_calls"
                        value={
                          formData.support_calls
                        }
                        onChange={handleChange}
                        placeholder="e.g. 2"
                        min="0"
                        max="50"
                        required
                      />

                    </div>

                  </div>


                  <button
                    type="submit"
                    className="predict-button"
                    disabled={loading}
                  >
                    {loading
                      ? "Analyzing Customer..."
                      : "Predict Renewal"}
                  </button>

                </form>

              </div>


              {/* Prediction Result */}

              <div className="result-card">

                {!result ? (

                  <div className="empty-result">

                    <div className="result-icon">
                      <Brain size={36} />
                    </div>

                    <h2>
                      Prediction Result
                    </h2>

                    <p>
                      Enter customer details and click{" "}
                      <strong>
                        Predict Renewal
                      </strong>{" "}
                      to generate an AI-powered
                      prediction.
                    </p>

                  </div>

                ) : (

                  <div className="result-content">

                    {result.prediction === 1 ? (

                      <div className="result-success">
                        <UserCheck size={42} />
                      </div>

                    ) : (

                      <div className="result-risk">
                        <AlertTriangle size={42} />
                      </div>

                    )}


                    <span className="result-label">
                      PREDICTION RESULT
                    </span>


                    <h2>
                      {result.status}
                    </h2>


                    <div className="probability">

                      <span>
                        Renewal Probability
                      </span>

                      <strong>
                        {result.renewal_probability}%
                      </strong>

                    </div>


                    <div className="progress-bar">

                      <div
                        className={
                          result.prediction === 1
                            ? "progress-fill success"
                            : "progress-fill risk"
                        }
                        style={{
                          width: `${result.renewal_probability}%`,
                        }}
                      ></div>

                    </div>


                    <p className="result-message">

                      {result.prediction === 1
                        ? "This customer has a high likelihood of renewing the subscription."
                        : "This customer may be at risk of cancellation. Consider retention actions."}

                    </p>

                  </div>

                )}

              </div>

            </section>

          </>
        )}


        {/* ====================================================
            CUSTOMERS PAGE
        ==================================================== */}

        {activePage === "customers" && (
          <>

            <header className="topbar">

              <div>

                <p className="eyebrow">
                  CUSTOMER MANAGEMENT
                </p>

                <h1>
                  Customers
                </h1>

                <p className="subtitle">
                  View customers and their latest renewal
                  predictions.
                </p>

              </div>


              <div className="ai-badge">
                <Users size={17} />
                {customers.length} Customers
              </div>

            </header>


            <section className="prediction-card">

              <div className="section-heading">

                <div>

                  <h2>
                    Customer Records
                  </h2>

                  <p>
                    Customer information retrieved from
                    Django.
                  </p>

                </div>

              </div>


              {/* Search */}

              <div className="customer-search">

                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search by ID, gender or status..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />

              </div>


              {customersLoading ? (

                <div className="empty-result">

                  <div className="result-icon">
                    <Brain size={30} />
                  </div>

                  <h2>
                    Loading Customers...
                  </h2>

                  <p>
                    Fetching customer data from the
                    backend.
                  </p>

                </div>

              ) : filteredCustomers.length === 0 ? (

                <div className="empty-result">

                  <div className="result-icon">
                    <Users size={30} />
                  </div>

                  <h2>
                    No Customers Found
                  </h2>

                  <p>
                    No customer records match your
                    search.
                  </p>

                </div>

              ) : (

                <div className="table-container">

                  <table className="customer-table">

                    <thead>

                      <tr>

                        <th>ID</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Tenure</th>
                        <th>Monthly Charges</th>
                        <th>Support Calls</th>
                        <th>Probability</th>
                        <th>Status</th>

                      </tr>

                    </thead>


                    <tbody>

                      {filteredCustomers.map(
                        (customer) => (

                          <tr
                            key={
                              customer.customer_id
                            }
                          >

                            <td>
                              <strong>
                                #{customer.customer_id}
                              </strong>
                            </td>

                            <td>
                              {customer.age}
                            </td>

                            <td>
                              {customer.gender}
                            </td>

                            <td>
                              {customer.tenure} months
                            </td>

                            <td>
                              $
                              {Number(
                                customer.monthly_charges
                              ).toFixed(2)}
                            </td>

                            <td>
                              {customer.support_calls}
                            </td>

                            <td>

                              <div className="probability-cell">

                                <strong>
                                  {
                                    customer.renewal_probability
                                  }%
                                </strong>

                                <div className="mini-progress">

                                  <div
                                    style={{
                                      width: `${customer.renewal_probability}%`,
                                    }}
                                  ></div>

                                </div>

                              </div>

                            </td>

                            <td>

                              <span
                                className={
                                  customer.prediction === 1
                                    ? "status-badge success"
                                    : "status-badge risk"
                                }
                              >
                                {customer.status}
                              </span>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          </>
        )}


        {/* ====================================================
            PREDICTIONS PAGE
        ==================================================== */}

        {activePage === "predictions" && (
          <>

            <header className="topbar">

              <div>

                <p className="eyebrow">
                  AI PREDICTION HISTORY
                </p>

                <h1>
                  Prediction History
                </h1>

                <p className="subtitle">
                  View all customer renewal predictions
                  generated by the AI model.
                </p>

              </div>


              <div className="ai-badge">
                <UserCheck size={17} />
                {predictions.length} Predictions
              </div>

            </header>


            <section className="prediction-card">

              <div className="section-heading">

                <div>

                  <h2>
                    Prediction Records
                  </h2>

                  <p>
                    Historical predictions retrieved
                    from Django.
                  </p>

                </div>

              </div>


              {/* Search */}

              <div className="customer-search">

                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search by prediction ID, customer ID, gender or status..."
                  value={predictionSearch}
                  onChange={(e) =>
                    setPredictionSearch(
                      e.target.value
                    )
                  }
                />

              </div>


              {predictionsLoading ? (

                <div className="empty-result">

                  <div className="result-icon">
                    <Brain size={30} />
                  </div>

                  <h2>
                    Loading Predictions...
                  </h2>

                  <p>
                    Fetching prediction history from
                    the backend.
                  </p>

                </div>

              ) : filteredPredictions.length === 0 ? (

                <div className="empty-result">

                  <div className="result-icon">
                    <UserCheck size={30} />
                  </div>

                  <h2>
                    No Predictions Found
                  </h2>

                  <p>
                    No prediction records match your
                    search.
                  </p>

                </div>

              ) : (

                <div className="table-container">

                  <table className="customer-table">

                    <thead>

                      <tr>

                        <th>Prediction ID</th>
                        <th>Customer</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Tenure</th>
                        <th>Monthly Charges</th>
                        <th>Probability</th>
                        <th>Status</th>

                      </tr>

                    </thead>


                    <tbody>

                      {filteredPredictions.map(
                        (item) => (

                          <tr
                            key={
                              item.prediction_id
                            }
                          >

                            <td>
                              <strong>
                                #{item.prediction_id}
                              </strong>
                            </td>

                            <td>
                              Customer #
                              {item.customer_id}
                            </td>

                            <td>
                              {item.age}
                            </td>

                            <td>
                              {item.gender}
                            </td>

                            <td>
                              {item.tenure} months
                            </td>

                            <td>
                              $
                              {Number(
                                item.monthly_charges
                              ).toFixed(2)}
                            </td>

                            <td>

                              <div className="probability-cell">

                                <strong>
                                  {
                                    item.renewal_probability
                                  }%
                                </strong>

                                <div className="mini-progress">

                                  <div
                                    style={{
                                      width: `${item.renewal_probability}%`,
                                    }}
                                  ></div>

                                </div>

                              </div>

                            </td>

                            <td>

                              <span
                                className={
                                  item.prediction === 1
                                    ? "status-badge success"
                                    : "status-badge risk"
                                }
                              >
                                {item.status}
                              </span>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          </>
        )}


        {/* ====================================================
            ANALYTICS PAGE
        ==================================================== */}

        {activePage === "analytics" && (
          <>

            <header className="topbar">

              <div>

                <p className="eyebrow">
                  AI CUSTOMER ANALYTICS
                </p>

                <h1>
                  Analytics
                </h1>

                <p className="subtitle">
                  Analyze customer renewal predictions
                  and identify customers at risk.
                </p>

              </div>


              <div className="ai-badge">
                <TrendingUp size={17} />
                Live Analytics
              </div>

            </header>


            {/* Analytics Statistics */}

            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon blue">
                  <Users size={22} />
                </div>

                <div>
                  <span>Total Predictions</span>

                  <h2>
                    {totalPredictions}
                  </h2>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon green">
                  <UserCheck size={22} />
                </div>

                <div>
                  <span>Renewal Rate</span>

                  <h2>
                    {renewalRate}%
                  </h2>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon orange">
                  <AlertTriangle size={22} />
                </div>

                <div>
                  <span>At Risk</span>

                  <h2>
                    {atRiskRate}%
                  </h2>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon purple">
                  <Brain size={22} />
                </div>

                <div>
                  <span>Avg. Probability</span>

                  <h2>
                    {averageProbability}%
                  </h2>
                </div>

              </div>

            </section>


            {/* Analytics Cards */}

            <section className="analytics-grid">


              {/* Renewal Overview */}

              <div className="analytics-card">

                <div className="analytics-card-header">

                  <div>

                    <h2>
                      Renewal Overview
                    </h2>

                    <p>
                      Customer prediction distribution
                    </p>

                  </div>

                  <UserCheck size={22} />

                </div>


                <div className="chart-container">

                  {/* Likely to Renew */}

                  <div className="chart-row">

                    <div className="chart-label">

                      <span>
                        Likely to Renew
                      </span>

                      <strong>
                        {renewedCustomers}
                      </strong>

                    </div>


                    <div className="chart-bar">

                      <div
                        className="chart-fill renewal"
                        style={{
                          width: `${renewalRate}%`,
                        }}
                      ></div>

                    </div>


                    <span className="chart-percent">
                      {renewalRate}%
                    </span>

                  </div>


                  {/* At Risk */}

                  <div className="chart-row">

                    <div className="chart-label">

                      <span>
                        At Risk
                      </span>

                      <strong>
                        {atRiskCustomers}
                      </strong>

                    </div>


                    <div className="chart-bar">

                      <div
                        className="chart-fill risk"
                        style={{
                          width: `${atRiskRate}%`,
                        }}
                      ></div>

                    </div>


                    <span className="chart-percent">
                      {atRiskRate}%
                    </span>

                  </div>

                </div>

              </div>


              {/* Probability Distribution */}

              <div className="analytics-card">

                <div className="analytics-card-header">

                  <div>

                    <h2>
                      Probability Distribution
                    </h2>

                    <p>
                      Customers grouped by renewal
                      probability
                    </p>

                  </div>

                  <TrendingUp size={22} />

                </div>


                <div className="distribution-container">


                  {/* High */}

                  <div className="distribution-item">

                    <div className="distribution-info">

                      <span>
                        High Probability
                      </span>

                      <strong>
                        {highProbability}
                      </strong>

                    </div>


                    <div className="distribution-bar">

                      <div
                        className="distribution-fill high"
                        style={{
                          width:
                            totalPredictions > 0
                              ? `${
                                  (highProbability /
                                    totalPredictions) *
                                  100
                                }%`
                              : "0%",
                        }}
                      ></div>

                    </div>


                    <small>
                      70% - 100%
                    </small>

                  </div>


                  {/* Medium */}

                  <div className="distribution-item">

                    <div className="distribution-info">

                      <span>
                        Medium Probability
                      </span>

                      <strong>
                        {mediumProbability}
                      </strong>

                    </div>


                    <div className="distribution-bar">

                      <div
                        className="distribution-fill medium"
                        style={{
                          width:
                            totalPredictions > 0
                              ? `${
                                  (mediumProbability /
                                    totalPredictions) *
                                  100
                                }%`
                              : "0%",
                        }}
                      ></div>

                    </div>


                    <small>
                      40% - 69%
                    </small>

                  </div>


                  {/* Low */}

                  <div className="distribution-item">

                    <div className="distribution-info">

                      <span>
                        Low Probability
                      </span>

                      <strong>
                        {lowProbability}
                      </strong>

                    </div>


                    <div className="distribution-bar">

                      <div
                        className="distribution-fill low"
                        style={{
                          width:
                            totalPredictions > 0
                              ? `${
                                  (lowProbability /
                                    totalPredictions) *
                                  100
                                }%`
                              : "0%",
                        }}
                      ></div>

                    </div>


                    <small>
                      0% - 39%
                    </small>

                  </div>

                </div>

              </div>

            </section>


            {/* AI Insight */}

            <section className="insight-card">

              <div className="insight-icon">
                <Sparkles size={25} />
              </div>


              <div>

                <h2>
                  AI Insight
                </h2>


                {totalPredictions === 0 ? (

                  <p>
                    No predictions are available yet.
                    Make a customer prediction from the
                    Dashboard to generate analytics.
                  </p>

                ) : renewalRate >= 70 ? (

                  <p>
                    Most predicted customers have a
                    high likelihood of renewal. The
                    current renewal outlook is positive.
                  </p>

                ) : renewalRate >= 50 ? (

                  <p>
                    Customer renewal is currently
                    moderate. Consider monitoring
                    customers with lower renewal
                    probabilities.
                  </p>

                ) : (

                  <p>
                    A significant number of customers
                    may be at risk of cancellation.
                    Retention actions should be
                    considered.
                  </p>

                )}

              </div>

            </section>

          </>
        )}

      </main>

    </div>
  );
}

export default App;