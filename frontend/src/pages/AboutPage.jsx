import React from 'react';
import styled from 'styled-components';

const AboutPageContainer = styled.div`
  width: 100%;
  max-width: 800px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    color: var(--primary-color);
    margin-bottom: 15px;
  }
`;

const AboutContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 30px;
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 15px;
    font-size: 1.5rem;
  }
  
  p {
    margin-bottom: 20px;
    line-height: 1.6;
    color: #444;
  }
  
  ul {
    margin-bottom: 20px;
    padding-left: 20px;
    
    li {
      margin-bottom: 10px;
      line-height: 1.6;
      color: #444;
    }
  }
`;

const HoursSection = styled.div`
  margin-top: 30px;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    th {
      color: var(--primary-color);
      font-weight: 600;
    }
  }
`;

function AboutPage() {
  return (
    <AboutPageContainer>
      <PageHeader>
        <h1>About Green Delight</h1>
      </PageHeader>
      
      <AboutContent>
        <h2>Our Story</h2>
        <p>
          Green Delight was founded in 2020 with a simple mission: to provide delicious, 
          high-quality vegetarian cuisine that appeals to everyone, not just vegetarians. 
          Our founder, Chef Maria Chen, combined her culinary expertise with her passion 
          for sustainable, plant-based eating to create a restaurant that celebrates the 
          incredible flavors and textures of vegetarian cooking.
        </p>
        
        <h2>Our Philosophy</h2>
        <p>
          At Green Delight, we believe that vegetarian food should be exciting, satisfying, 
          and accessible to all. We source our ingredients locally whenever possible, 
          supporting sustainable farming practices and reducing our carbon footprint. 
          Our menu changes seasonally to showcase the freshest produce available.
        </p>
        
        <h2>What Makes Us Special</h2>
        <ul>
          <li>100% vegetarian menu with many vegan options</li>
          <li>Locally sourced, organic ingredients</li>
          <li>Innovative recipes that reimagine classic dishes</li>
          <li>Warm, welcoming atmosphere for all dietary preferences</li>
          <li>Commitment to sustainability in all aspects of our business</li>
        </ul>
        
        <HoursSection>
          <h2>Hours of Operation</h2>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monday - Thursday</td>
                <td>11:00 AM - 9:00 PM</td>
              </tr>
              <tr>
                <td>Friday - Saturday</td>
                <td>11:00 AM - 10:00 PM</td>
              </tr>
              <tr>
                <td>Sunday</td>
                <td>11:00 AM - 8:00 PM</td>
              </tr>
            </tbody>
          </table>
        </HoursSection>
      </AboutContent>
    </AboutPageContainer>
  );
}

export default AboutPage;
