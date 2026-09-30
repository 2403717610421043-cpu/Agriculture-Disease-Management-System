import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate
} from 'react-router-dom';

import api from './api';


/* =========================================================
   LAYOUT
========================================================= */

function Layout({ user, setUser, children }) {
  const nav = useNavigate();

  const logout = () => {
    localStorage.clear();
    setUser(null);
    nav('/login');
  };

  return (
    <div className="app">

      <header className="topbar">

        <Link to="/" className="brand">
          🌿 AgriCare
        </Link>

        {user ? (
          <div className="userbar">
            <span>
              {user.name} · {user.role}
            </span>

            <button onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <nav>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </nav>
        )}

      </header>


      {user && (
        <aside className="sidebar">

          <Link to="/dashboard">
            Dashboard
          </Link>


          {user.role === 'farmer' && (
            <>
              <Link to="/crops">
                My Crops
              </Link>

              <Link to="/report">
                Disease Report
              </Link>

              <Link to="/queries">
                Queries
              </Link>

              <Link to="/tips">
                Farming Tips
              </Link>

              <Link to="/diseases">
                Disease Info
              </Link>
            </>
          )}


          {user.role === 'expert' && (
            <>
              <Link to="/reports">
                Disease Reports
              </Link>

              <Link to="/queries">
                Farmer Queries
              </Link>

              <Link to="/tips">
                Farming Tips
              </Link>

              <Link to="/analytics">
                Analytics
              </Link>
            </>
          )}


          {user.role === 'scientist' && (
            <>
              <Link to="/research">
                Research
              </Link>

              <Link to="/analytics">
                Analytics
              </Link>
            </>
          )}


          {user.role === 'admin' && (
            <>
              <Link to="/admin">
                Users
              </Link>

              <Link to="/diseases">
                Disease Database
              </Link>

              <Link to="/analytics">
                Analytics
              </Link>
            </>
          )}

        </aside>
      )}


      <main className={user ? 'content' : 'public-content'}>
        {children}
      </main>

    </div>
  );
}


/* =========================================================
   PROTECTED ROUTE
========================================================= */

function Protected({ user, children, roles }) {

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}


/* =========================================================
   HOME
========================================================= */

function Home() {
  return (
    <div className="hero">

      <div>

        <span className="eyebrow">
          DIGITAL CROP HEALTH PLATFORM
        </span>

        <h1>
          Protect crops.
          <br />
          <span>Support farmers.</span>
        </h1>

        <p>
          Report crop diseases, connect with agriculture experts,
          access treatment guidance and manage crop health from
          one platform.
        </p>

        <Link className="primary" to="/register">
          Get Started
        </Link>

      </div>


      <div className="hero-card">

        <div className="leaf">
          🌾
        </div>

        <h3>
          Smart Disease Management
        </h3>

        <p>
          From early reporting to expert diagnosis and treatment
          recommendations.
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   LOGIN
========================================================= */

function Login({ setUser }) {

  const [f, setF] = useState({
    email: '',
    password: ''
  });

  const [msg, setMsg] = useState('');

  const nav = useNavigate();


  const submit = async (e) => {

    e.preventDefault();

    try {

      const r = await api.post('/auth/login', f);

      localStorage.setItem(
        'token',
        r.data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(r.data.user)
      );

      setUser(r.data.user);

      nav('/dashboard');

    } catch (e) {

      setMsg(
        e.response?.data?.message ||
        'Login failed'
      );

    }

  };


  return (
    <FormCard title="Welcome back">

      <form onSubmit={submit}>

        <input
          placeholder="Email"
          type="email"
          value={f.email}
          onChange={(e) =>
            setF({
              ...f,
              email: e.target.value
            })
          }
        />

        <input
          placeholder="Password"
          type="password"
          value={f.password}
          onChange={(e) =>
            setF({
              ...f,
              password: e.target.value
            })
          }
        />

        <button className="primary full">
          Login
        </button>

        {msg && (
          <div className="error">
            {msg}
          </div>
        )}

      </form>

      <p className="hint">
        Demo: farmer@example.com / Password@123
      </p>

    </FormCard>
  );
}


/* =========================================================
   REGISTER
========================================================= */

function Register() {

  const [f, setF] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const [msg, setMsg] = useState('');

  const nav = useNavigate();


  const submit = async (e) => {

    e.preventDefault();

    try {

      await api.post('/auth/register', f);

      setMsg(
        'Registration successful. You can now login.'
      );

      setTimeout(() => {
        nav('/login');
      }, 900);

    } catch (e) {

      setMsg(
        e.response?.data?.message ||
        'Registration failed'
      );

    }

  };


  return (
    <FormCard title="Create Farmer Account">

      <form onSubmit={submit}>

        {[
          'name',
          'email',
          'phone',
          'address'
        ].map((x) => (

          <input
            key={x}
            placeholder={
              x[0].toUpperCase() + x.slice(1)
            }
            value={f[x]}
            onChange={(e) =>
              setF({
                ...f,
                [x]: e.target.value
              })
            }
          />

        ))}


        <input
          placeholder="Password"
          type="password"
          value={f.password}
          onChange={(e) =>
            setF({
              ...f,
              password: e.target.value
            })
          }
        />


        <button className="primary full">
          Register
        </button>


        {msg && (
          <div className="success">
            {msg}
          </div>
        )}

      </form>

    </FormCard>
  );
}


/* =========================================================
   FORM CARD
========================================================= */

function FormCard({ title, children }) {

  return (
    <div className="form-wrap">

      <div className="form-card">

        <h2>
          {title}
        </h2>

        {children}

      </div>

    </div>
  );
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ user }) {

  return (
    <div>

      <div className="page-head">

        <div>

          <span className="eyebrow">
            OVERVIEW
          </span>

          <h1>
            Hello, {user.name}
          </h1>

          <p>
            Your {user.role} workspace.
          </p>

        </div>

      </div>


      <div className="cards">

        <div className="stat">
          <span>Role</span>
          <strong>{user.role}</strong>
          <small>Access level</small>
        </div>


        <div className="stat">
          <span>Platform</span>
          <strong>AgriCare</strong>
          <small>Crop health management</small>
        </div>


        <div className="stat">
          <span>Status</span>
          <strong>Active</strong>
          <small>Secure session</small>
        </div>

      </div>


      <div className="panel">

        <h3>
          SRS Modules
        </h3>

        <div className="feature-grid">

          <div>
            🌱 Disease Reporting
          </div>

          <div>
            🩺 Expert Diagnosis
          </div>

          <div>
            💊 Treatment Guidance
          </div>

          <div>
            💬 Expert Consultation
          </div>

          <div>
            📚 Disease Knowledge
          </div>

          <div>
            📊 Agricultural Analytics
          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   CROPS
========================================================= */

function Crops() {

  const [rows, setRows] = useState([]);

  const [f, setF] = useState({
    crop_name: '',
    variety: '',
    planting_date: '',
    area: ''
  });


  const load = async () => {

    try {

      const r = await api.get('/crops');

      setRows(r.data);

    } catch (e) {

      console.error(
        'Error loading crops:',
        e
      );

    }

  };


  /*
    IMPORTANT:
    Do NOT use:
    useEffect(load, []);

    because load returns a Promise.

    Instead use:
    useEffect(() => {
      load();
    }, []);
  */

  useEffect(() => {

    load();

  }, []);


  const add = async (e) => {

    e.preventDefault();

    try {

      await api.post('/crops', f);

      setF({
        crop_name: '',
        variety: '',
        planting_date: '',
        area: ''
      });

      load();

    } catch (e) {

      console.error(
        'Error adding crop:',
        e
      );

    }

  };


  return (
    <Section
      title="My Crops"
      subtitle="Manage your crop records"
    >

      <form
        className="inline-form"
        onSubmit={add}
      >

        <input
          placeholder="Crop name"
          value={f.crop_name}
          onChange={(e) =>
            setF({
              ...f,
              crop_name: e.target.value
            })
          }
        />

        <input
          placeholder="Variety"
          value={f.variety}
          onChange={(e) =>
            setF({
              ...f,
              variety: e.target.value
            })
          }
        />

        <input
          type="date"
          value={f.planting_date}
          onChange={(e) =>
            setF({
              ...f,
              planting_date: e.target.value
            })
          }
        />

        <input
          placeholder="Area"
          value={f.area}
          onChange={(e) =>
            setF({
              ...f,
              area: e.target.value
            })
          }
        />

        <button className="primary">
          Add
        </button>

      </form>


      <Table
        rows={rows}
        cols={[
          'crop_name',
          'variety',
          'planting_date',
          'area'
        ]}
      />

    </Section>
  );
}


/* =========================================================
   DISEASE REPORT FORM
========================================================= */

function ReportForm() {

  const [f, setF] = useState({
    crop_name: '',
    symptoms: '',
    description: '',
    image: null
  });

  const [msg, setMsg] = useState('');


  const submit = async (e) => {

    e.preventDefault();

    const d = new FormData();

    Object.entries(f).forEach(([k, v]) => {

      if (v !== null) {
        d.append(k, v);
      }

    });


    try {

      await api.post(
        '/reports',
        d,
        {
          headers: {
            'Content-Type':
              'multipart/form-data'
          }
        }
      );

      setMsg(
        'Disease report submitted successfully.'
      );

      setF({
        crop_name: '',
        symptoms: '',
        description: '',
        image: null
      });

    } catch (e) {

      setMsg(
        e.response?.data?.message ||
        'Submission failed'
      );

    }

  };


  return (
    <FormCard title="Report Crop Disease">

      <form onSubmit={submit}>

        <input
          placeholder="Crop name"
          value={f.crop_name}
          onChange={(e) =>
            setF({
              ...f,
              crop_name: e.target.value
            })
          }
        />


        <textarea
          placeholder="Disease symptoms"
          value={f.symptoms}
          onChange={(e) =>
            setF({
              ...f,
              symptoms: e.target.value
            })
          }
        />


        <textarea
          placeholder="Additional description"
          value={f.description}
          onChange={(e) =>
            setF({
              ...f,
              description: e.target.value
            })
          }
        />


        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setF({
              ...f,
              image:
                e.target.files[0] || null
            })
          }
        />


        <button className="primary full">
          Submit Report
        </button>


        {msg && (
          <div className="success">
            {msg}
          </div>
        )}

      </form>

    </FormCard>
  );
}


/* =========================================================
   EXPERT REPORTS
========================================================= */

function Reports() {

  const [rows, setRows] = useState([]);

  const [diseases, setDiseases] = useState([]);

  const [selected, setSelected] =
    useState(null);

  const [f, setF] = useState({
    disease_id: '',
    diagnosis: '',
    treatment: '',
    recommendation: ''
  });


  const load = async () => {

    try {

      const r = await api.get('/reports');

      setRows(r.data);

    } catch (e) {

      console.error(
        'Error loading reports:',
        e
      );

    }

  };


  useEffect(() => {

    load();

    const loadDiseases = async () => {

      try {

        const r =
          await api.get('/diseases');

        setDiseases(r.data);

      } catch (e) {

        console.error(
          'Error loading diseases:',
          e
        );

      }

    };

    loadDiseases();

  }, []);


  const diagnose = async (e) => {

    e.preventDefault();

    try {

      await api.put(
        '/reports/' +
          selected +
          '/diagnose',
        f
      );

      setSelected(null);

      setF({
        disease_id: '',
        diagnosis: '',
        treatment: '',
        recommendation: ''
      });

      load();

    } catch (e) {

      console.error(
        'Error saving diagnosis:',
        e
      );

    }

  };


  return (
    <Section
      title="Disease Reports"
      subtitle="Review farmer submissions and provide diagnosis"
    >

      <Table
        rows={rows}
        cols={[
          'id',
          'farmer_name',
          'crop_name',
          'symptoms',
          'status'
        ]}
        action={(r) => (
          <button
            onClick={() =>
              setSelected(r.id)
            }
          >
            Diagnose
          </button>
        )}
      />


      {selected && (

        <div className="modal">

          <div className="modal-card">

            <h3>
              Expert Diagnosis
            </h3>


            <form onSubmit={diagnose}>

              <select
                value={f.disease_id}
                onChange={(e) =>
                  setF({
                    ...f,
                    disease_id:
                      e.target.value
                  })
                }
              >

                <option value="">
                  Select disease
                </option>

                {diseases.map((d) => (

                  <option
                    key={d.id}
                    value={d.id}
                  >
                    {d.disease_name}
                  </option>

                ))}

              </select>


              <textarea
                placeholder="Diagnosis"
                value={f.diagnosis}
                onChange={(e) =>
                  setF({
                    ...f,
                    diagnosis:
                      e.target.value
                  })
                }
              />


              <textarea
                placeholder="Treatment"
                value={f.treatment}
                onChange={(e) =>
                  setF({
                    ...f,
                    treatment:
                      e.target.value
                  })
                }
              />


              <textarea
                placeholder="Recommendation"
                value={f.recommendation}
                onChange={(e) =>
                  setF({
                    ...f,
                    recommendation:
                      e.target.value
                  })
                }
              />


              <button className="primary">
                Save Diagnosis
              </button>

            </form>


            <button
              onClick={() =>
                setSelected(null)
              }
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </Section>
  );
}


/* =========================================================
   QUERIES
========================================================= */

function Queries({ user }) {
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ subject: '', message: '' });
  const [response, setResponse] = useState({});

  const load = () => {
    api.get('/queries')
      .then(r => setRows(r.data))
      .catch(e => console.error('Error loading queries:', e));
  };

  useEffect(() => {
    load();
  }, []);

  // Farmer submits a new query
  const add = async e => {
    e.preventDefault();

    try {
      await api.post('/queries', f);

      setF({
        subject: '',
        message: ''
      });

      load();
    } catch (e) {
      console.error('Error adding query:', e);
    }
  };

  // Expert responds to farmer query
  const respond = async id => {
    try {
      await api.put('/queries/' + id + '/respond', {
        response: response[id]
      });

      setResponse({
        ...response,
        [id]: ''
      });

      load();
    } catch (e) {
      console.error('Error responding to query:', e);
    }
  };

  return (
    <Section
      title="Queries"
      subtitle={
        user.role === 'farmer'
          ? 'Ask agriculture experts for help'
          : 'Respond to farmer queries'
      }
    >

      {/* ================= FARMER ================= */}
      {user.role === 'farmer' && (
        <form className="simple-form" onSubmit={add}>
          <h3>Ask an Expert</h3>

          <input
            placeholder="Subject"
            value={f.subject}
            onChange={e =>
              setF({
                ...f,
                subject: e.target.value
              })
            }
          />

          <textarea
            placeholder="Describe your question"
            value={f.message}
            onChange={e =>
              setF({
                ...f,
                message: e.target.value
              })
            }
          />

          <button className="primary">
            Submit Query
          </button>
        </form>
      )}

      {/* ================= QUERIES LIST ================= */}
      {rows.map(r => (
        <div className="list-card" key={r.id}>

          <b>{r.subject}</b>

          <p>{r.message}</p>

          {/* FARMER ONLY: See expert response */}
          {user.role === 'farmer' && (
            r.response ? (
              <div className="response">
                <b>Expert response:</b>
                <p>{r.response}</p>
              </div>
            ) : (
              <div className="hint">
                Waiting for expert response...
              </div>
            )
          )}

          {/* EXPERT ONLY: Respond */}
          {user.role === 'expert' && (
            r.response ? (
              <div className="response">
                <b>Response:</b>
                <p>{r.response}</p>
              </div>
            ) : (
              <div>
                <textarea
                  placeholder="Expert response"
                  value={response[r.id] || ''}
                  onChange={e =>
                    setResponse({
                      ...response,
                      [r.id]: e.target.value
                    })
                  }
                />

                <button
                  onClick={() => respond(r.id)}
                >
                  Respond
                </button>
              </div>
            )
          )}

        </div>
      ))}

    </Section>
  );
}

/* =========================================================
   FARMING TIPS
========================================================= */

function Tips({ user }) {
  const [rows, setRows] = useState([]);

  const [f, setF] = useState({
    title: '',
    category: '',
    content: ''
  });

  const load = () => {
    api.get('/tips')
      .then(r => setRows(r.data))
      .catch(e => console.error('Error loading tips:', e));
  };

  useEffect(() => {
    load();
  }, []);

  const add = async e => {
    e.preventDefault();

    try {
      await api.post('/tips', f);

      setF({
        title: '',
        category: '',
        content: ''
      });

      load();
    } catch (e) {
      console.error('Error adding tip:', e);
    }
  };

  return (
    <Section
      title="Farming Tips"
      subtitle="Practical crop health guidance"
    >

      {/* Search - both farmer and expert can use */}
      <form
        className="simple-form"
        onSubmit={e => e.preventDefault()}
      >
        <input
          placeholder="Search tips"
        />
      </form>

      {/* ================= TIPS LIST ================= */}
      <div className="tip-grid">
        {rows.map(t => (
          <div className="tip" key={t.id}>

            <span>{t.category}</span>

            <h3>{t.title}</h3>

            <p>{t.content}</p>

          </div>
        ))}
      </div>

      {/* ================= EXPERT ONLY ================= */}
      {user.role === 'expert' && (
        <form
          className="simple-form"
          onSubmit={add}
        >
          <h3>Add Tip</h3>

          <input
            placeholder="Title"
            value={f.title}
            onChange={e =>
              setF({
                ...f,
                title: e.target.value
              })
            }
          />

          <input
            placeholder="Category"
            value={f.category}
            onChange={e =>
              setF({
                ...f,
                category: e.target.value
              })
            }
          />

          <textarea
            placeholder="Content"
            value={f.content}
            onChange={e =>
              setF({
                ...f,
                content: e.target.value
              })
            }
          />

          <button className="primary">
            Add Tip
          </button>
        </form>
      )}

    </Section>
  );
}

function Diseases() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');

  const load = () => {
    api.get('/diseases?q=' + encodeURIComponent(q))
      .then(r => setRows(r.data))
      .catch(e => {
        console.error('Error loading diseases:', e);
      });
  };

  useEffect(() => {
    load();
  }, [q]);

  return (
    <Section
      title="Disease Information"
      subtitle="Search the disease knowledge base"
    >
      <input
        className="search"
        placeholder="Search disease or crop"
        value={q}
        onChange={e => setQ(e.target.value)}
      />

      <div className="disease-grid">
        {rows.map(d => (
          <div className="disease" key={d.id}>
            <h3>{d.disease_name}</h3>

            <span>{d.crop}</span>

            <p>
              <b>Symptoms:</b> {d.symptoms}
            </p>

            <p>
              <b>Prevention:</b> {d.prevention}
            </p>

            <p>
              <b>Treatment:</b> {d.treatment}
            </p>
          </div>
        ))}
      </div>

      {!rows.length && (
        <div className="empty">
          No disease information found.
        </div>
      )}
    </Section>
  );
}

/* =========================================================
   RESEARCH
========================================================= */

function Research() {

  const [rows, setRows] =
    useState([]);

  const [f, setF] = useState({
    title: '',
    crop: '',
    disease: '',
    findings: '',
    published: false
  });


  const load = async () => {

    try {

      const r =
        await api.get('/research');

      setRows(r.data);

    } catch (e) {

      console.error(
        'Error loading research:',
        e
      );

    }

  };


  useEffect(() => {

    load();

  }, []);


  const add = async (e) => {

    e.preventDefault();

    try {

      await api.post('/research', f);

      setF({
        title: '',
        crop: '',
        disease: '',
        findings: '',
        published: false
      });

      load();

    } catch (e) {

      console.error(
        'Error adding research:',
        e
      );

    }

  };


  return (
    <Section
      title="Agricultural Research"
      subtitle="Analyze trends and publish findings"
    >

      <div className="research-grid">

        {rows.map((r) => (

          <div
            className="list-card"
            key={r.id}
          >

            <span>
              {r.crop} · {r.disease}
            </span>

            <h3>
              {r.title}
            </h3>

            <p>
              {r.findings}
            </p>

          </div>

        ))}

      </div>


      <form
        className="simple-form"
        onSubmit={add}
      >

        <h3>
          Publish Finding
        </h3>


        <input
          placeholder="Title"
          value={f.title}
          onChange={(e) =>
            setF({
              ...f,
              title:
                e.target.value
            })
          }
        />


        <input
          placeholder="Crop"
          value={f.crop}
          onChange={(e) =>
            setF({
              ...f,
              crop:
                e.target.value
            })
          }
        />


        <input
          placeholder="Disease"
          value={f.disease}
          onChange={(e) =>
            setF({
              ...f,
              disease:
                e.target.value
            })
          }
        />


        <textarea
          placeholder="Findings"
          value={f.findings}
          onChange={(e) =>
            setF({
              ...f,
              findings:
                e.target.value
            })
          }
        />


        <label>

          <input
            type="checkbox"
            checked={f.published}
            onChange={(e) =>
              setF({
                ...f,
                published:
                  e.target.checked
              })
            }
          />

          {' '}Published

        </label>


        <button className="primary">
          Save
        </button>

      </form>

    </Section>
  );
}


/* =========================================================
   ADMIN
========================================================= */

function Admin() {

  const [rows, setRows] =
    useState([]);


  const load = async () => {

    try {

      const r =
        await api.get('/admin/users');

      setRows(r.data);

    } catch (e) {

      console.error(
        'Error loading users:',
        e
      );

    }

  };


  useEffect(() => {

    load();

  }, []);


  const toggle = async (r) => {

    try {

      await api.put(
        '/admin/users/' +
          r.id +
          '/status',
        {
          is_active:
            !r.is_active
        }
      );

      load();

    } catch (e) {

      console.error(
        'Error changing user status:',
        e
      );

    }

  };


  return (
    <Section
      title="User Management"
      subtitle="Administrator controls"
    >

      <Table
        rows={rows}
        cols={[
          'id',
          'name',
          'email',
          'role',
          'is_active',
          'created_at'
        ]}
        action={(r) => (

          <button
            onClick={() =>
              toggle(r)
            }
          >
            {r.is_active
              ? 'Deactivate'
              : 'Activate'}
          </button>

        )}
      />

    </Section>
  );
}


/* =========================================================
   ANALYTICS
========================================================= */

function Analytics() {

  const [d, setD] =
    useState(null);


  useEffect(() => {

    const load = async () => {

      try {

        const r =
          await api.get('/analytics');

        setD(r.data);

      } catch (e) {

        console.error(
          'Error loading analytics:',
          e
        );

      }

    };

    load();

  }, []);


  if (!d) {

    return (
      <Section title="Analytics">
        <p>
          Loading...
        </p>
      </Section>
    );

  }


  return (
    <Section
      title="Agricultural Analytics"
      subtitle="System and disease statistics"
    >

      <div className="cards">

        <div className="stat">
          <span>Users</span>
          <strong>{d.users}</strong>
        </div>

        <div className="stat">
          <span>Farmers</span>
          <strong>{d.farmers}</strong>
        </div>

        <div className="stat">
          <span>Experts</span>
          <strong>{d.experts}</strong>
        </div>

        <div className="stat">
          <span>Reports</span>
          <strong>{d.reports}</strong>
        </div>

        <div className="stat">
          <span>Pending</span>
          <strong>{d.pending}</strong>
        </div>

      </div>


      <div className="panel">

        <h3>
          Disease Distribution
        </h3>


        {d.diseaseStats.map((x) => (

          <div
            className="bar"
            key={x.disease}
          >

            <span>
              {x.disease}
            </span>

            <div>

              <i
                style={{
                  width:
                    Math.min(
                      100,
                      x.total * 15
                    ) + '%'
                }}
              />

            </div>

            <b>
              {x.total}
            </b>

          </div>

        ))}

      </div>

    </Section>
  );
}


/* =========================================================
   SECTION
========================================================= */

function Section({
  title,
  subtitle,
  children
}) {

  return (
    <div>

      <div className="page-head">

        <div>

          <span className="eyebrow">
            AGRICARE
          </span>

          <h1>
            {title}
          </h1>

          <p>
            {subtitle}
          </p>

        </div>

      </div>

      {children}

    </div>
  );
}


/* =========================================================
   TABLE
========================================================= */

function Table({
  rows,
  cols,
  action
}) {

  return (
    <div className="table-wrap">

      <table>

        <thead>

          <tr>

            {cols.map((c) => (

              <th key={c}>
                {c.replace('_', ' ')}
              </th>

            ))}

            {action && (
              <th>
                action
              </th>
            )}

          </tr>

        </thead>


        <tbody>

          {rows.map((r) => (

            <tr key={r.id}>

              {cols.map((c) => (

                <td key={c}>
                  {String(
                    r[c] ?? ''
                  )}
                </td>

              ))}


              {action && (
                <td>
                  {action(r)}
                </td>
              )}

            </tr>

          ))}

        </tbody>

      </table>


      {!rows.length && (

        <div className="empty">
          No records found.
        </div>

      )}

    </div>
  );
}


/* =========================================================
   MAIN APP
========================================================= */

export default function App() {

  const [user, setUser] =
    useState(() => {

      try {

        return JSON.parse(
          localStorage.getItem('user')
        );

      } catch {

        return null;

      }

    });


  useEffect(() => {

    if (user) {

      localStorage.setItem(
        'user',
        JSON.stringify(user)
      );

    }

  }, [user]);


  return (

    <Layout
      user={user}
      setUser={setUser}
    >

      <Routes>

        {/* PUBLIC */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={
            <Login
              setUser={setUser}
            />
          }
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <Protected user={user}>
              <Dashboard user={user} />
            </Protected>
          }
        />


        {/* FARMER */}

        <Route
          path="/crops"
          element={
            <Protected
              user={user}
              roles={['farmer']}
            >
              <Crops />
            </Protected>
          }
        />


        <Route
          path="/report"
          element={
            <Protected
              user={user}
              roles={['farmer']}
            >
              <ReportForm />
            </Protected>
          }
        />


        {/* EXPERT */}

        <Route
          path="/reports"
          element={
            <Protected
              user={user}
              roles={['expert']}
            >
              <Reports />
            </Protected>
          }
        />


        {/* FARMER + EXPERT */}

       <Route
  path="/queries"
  element={
    <Protected user={user} roles={['farmer', 'expert']}>
      <Queries user={user} />
    </Protected>
  }
/>

<Route
  path="/tips"
  element={
    <Protected user={user} roles={['farmer', 'expert']}>
      <Tips user={user} />
    </Protected>
  }
/>


        {/* FARMER + ADMIN */}

        <Route
          path="/diseases"
          element={
            <Protected
              user={user}
              roles={[
                'farmer',
                'admin'
              ]}
            >
              <Diseases />
            </Protected>
          }
        />


        {/* SCIENTIST */}

        <Route
          path="/research"
          element={
            <Protected
              user={user}
              roles={['scientist']}
            >
              <Research />
            </Protected>
          }
        />


        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <Protected
              user={user}
              roles={['admin']}
            >
              <Admin />
            </Protected>
          }
        />


        {/* ANALYTICS */}

        <Route
          path="/analytics"
          element={
            <Protected
              user={user}
              roles={[
                'admin',
                'expert',
                'scientist'
              ]}
            >
              <Analytics />
            </Protected>
          }
        />


        {/* UNKNOWN ROUTE */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                user
                  ? '/dashboard'
                  : '/'
              }
            />
          }
        />

      </Routes>

    </Layout>

  );
}