import { useState } from 'react';

const Company= () => {
  const [companies] = useState([
    { id: 1, name: 'Google', employees: '100,000+', openJobs: 1234 },
    { id: 2, name: 'Apple', employees: '150,000+', openJobs: 567 },
    { id: 3, name: 'Microsoft', employees: '180,000+', openJobs: 890 },
    { id: 4, name: 'Amazon', employees: '1,500,000+', openJobs: 2345 },
    { id: 5, name: 'Meta', employees: '80,000+', openJobs: 456 },
    { id: 6, name: 'Netflix', employees: '12,000+', openJobs: 123 },
    { id: 7, name: 'Tesla', employees: '100,000+', openJobs: 678 },
    { id: 8, name: 'Spotify', employees: '6,000+', openJobs: 234 },
  ]);

  return (
    <section
      style={{
        padding: '4rem 0',
        backgroundColor: 'rgba(243, 244, 246, 0.3)', // Equivalent to bg-surface/30
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem', // Equivalent to container-padding
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '4rem',
          }}
        >
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              marginBottom: '1rem',
              lineHeight: '1.2',
            }}
            className="md:text-5xl"
          >
            Top <span style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Companies</span>
          </h2>
          <p
            style={{
              fontSize: '1.25rem',
              color: '#6b7280', // Equivalent to text-text-secondary
              maxWidth: '32rem',
              margin: '0 auto',
            }}
          >
            Join industry leaders and innovative startups that are shaping the future
          </p>
        </div>

        {/* Company Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
          className="md:grid-cols-4"
        >
          {companies.map((company, index) => (
            <div
              key={company.id}
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                backgroundColor: '#fff',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {/* Company Logo Placeholder */}
              <div
                style={{
                  width: '4rem',
                  height: '4rem',
                  margin: '0 auto 1rem',
                  background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', // Equivalent to bg-gradient-primary
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'box-shadow 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <span
                  style={{
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '1.25rem',
                  }}
                >
                  {company.name.charAt(0)}
                </span>
              </div>

              <h3
                style={{
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  marginBottom: '0.5rem',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#3b82f6')} // Equivalent to group-hover:text-primary
                onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
              >
                {company.name}
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  fontSize: '0.875rem',
                  color: '#6b7280', // Equivalent to text-text-secondary
                }}
              >
                <p>{company.employees} employees</p>
                <p
                  style={{
                    color: '#3b82f6', // Equivalent to text-primary
                    fontWeight: '500',
                  }}
                >
                  {company.openJobs} open positions
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <button
            style={{
              padding: '0.5rem 1.5rem',
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', // Equivalent to btn-primary
              color: '#fff',
              borderRadius: '0.375rem',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #7c3aed)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(to right, #3b82f6, #8b5cf6)')}
          >
            Explore All Companies
            <svg
              style={{
                width: '1.25rem',
                height: '1.25rem',
                fill: 'none',
                stroke: 'currentColor',
              }}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Company;