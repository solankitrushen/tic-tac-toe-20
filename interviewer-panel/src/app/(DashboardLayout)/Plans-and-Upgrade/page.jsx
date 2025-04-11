'use client';
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Divider,
} from '@mui/material';

import SupportIcon from '@mui/icons-material/Support';
import { EmailOutlined, KeyOutlined, PeopleAltOutlined } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useUserData } from '@/store/useUserData';
import Link from 'next/link';
import PricingCard from './PricingCard';
import moment from 'moment';

const PlanName = ({ startDate, endDate }) => {
  const getPlanName = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);

    // Calculate the difference in months and years
    const monthsDiff = end.diff(start, 'months');
    const yearsDiff = end.diff(start, 'years');

    if (yearsDiff >= 1) {
      return 'Yearly';
    } else if (monthsDiff === 1) {
      return 'Monthly';
    } else {
      return 'Other Plan'; // fallback for other durations
    }
  };

  const planName = getPlanName(startDate, endDate);

  return <span>{planName} Plan</span>;
};

export default function SubscriptionManagement() {
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [subscription, setSubscription] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const { userData } = useUserData();

  useEffect(() => {
    const fetchSubscription = async () => {
      const token = Cookies.get('access');

      const sub = await axios.get('/subscribe/subscriptions/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (sub.status === 200) {
        setSubscription(sub.data);
      }
    };
    fetchSubscription();
  }, []);

  useEffect(() => {
    const fetchAvailablePlans = async () => {
      const token = Cookies.get('access');

      const plans = await axios.get('/subscribe/subscription-plans/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (plans.status === 200) {
        setAvailablePlans(plans.data);
      }
    };
    fetchAvailablePlans();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Your Subscription Card */}
      {subscription.length > 0 ? (
        <Card sx={{ backgroundColor: '#253662', boxShadow: 3, borderRadius: '10px' }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                Your Subscription
              </Typography>
            }
            action={
              <Typography variant="subtitle1" fontWeight="bold">
                will renew on {moment(subscription[0].end_date).format('DD, MMM YYYY')}
              </Typography>
            }
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Plan Title and Price */}
              <div className="flex flex-col items-start space-y-2">
                <Typography variant="h6" fontWeight="bold" className="flex items-center space-x-2">
                  <EmailOutlined color="primary" />
                  <PlanName
                    startDate={subscription[0].start_date}
                    endDate={subscription[0].end_date}
                  />
                </Typography>
              </div>

              {/* Email Validations */}
              <div className="flex items-center space-x-2">
                <EmailOutlined color="primary" />
                <Typography variant="body2">
                  {subscription[0].remaining_credits} Email Validations
                </Typography>
              </div>

              {/* API Key */}
              <div className="flex items-center space-x-2">
                <KeyOutlined color="primary" />
                <Typography variant="body2">1 API Key</Typography>
              </div>

              {/* Requests / Team Member */}
              {/* <div className="flex items-center space-x-2">
                <PeopleAltOutlined color="primary" />
                <Typography variant="body2">10 Requests / Min</Typography>
              </div> */}

              {/* Team Members */}
              {/* <div className="flex items-center space-x-2">
                <PeopleAltOutlined color="primary" />
                <Typography variant="body2">1 Team Member</Typography>
              </div> */}

              {/* Support */}
              <div className="flex items-center space-x-2">
                <SupportIcon color="primary" />
                <Typography variant="body2">Email Support</Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ backgroundColor: '#253662', boxShadow: 3, borderRadius: '10px' }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                Your Subscription
              </Typography>
            }
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Plan Title and Price */}
              <div className="flex flex-col items-start space-y-2">
                <Typography variant="h6" fontWeight="bold" className="flex items-center space-x-2">
                  <EmailOutlined color="primary" />
                  <span>Free Plan</span>
                </Typography>
              </div>

              {/* Email Validations */}
              <div className="flex items-center space-x-2">
                <EmailOutlined color="primary" />
                <Typography variant="body2">100 Email Validations</Typography>
              </div>

              {/* API Key */}
              <div className="flex items-center space-x-2">
                <KeyOutlined color="primary" />
                <Typography variant="body2">1 API Key</Typography>
              </div>

              {/* Requests / Team Member */}
              <div className="flex items-center space-x-2">
                <PeopleAltOutlined color="primary" />
                <Typography variant="body2">10 Requests / Min</Typography>
              </div>

              {/* Team Members */}

              {/* Support */}
              <div className="flex items-center space-x-2">
                <SupportIcon color="primary" />
                <Typography variant="body2">Email Support</Typography>
              </div>
            </div>
            <Typography variant="subtitle2" className="pt-3">
              You are currently on the Free Plan. To access additional features, please consider
              selecting one of the other available plans.
            </Typography>
          </CardContent>
        </Card>
      )}
      {/* Available Plans Card */}
      <Grid container spacing={3}>
        {availablePlans && availablePlans.length > 0 ? (
          availablePlans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <PricingCard
                id={plan.id}
                plan={plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                price={plan.price}
                features={Object.values(plan.features)}
                priceSlogan={plan.duration === 'monthly' ? 'per month' : 'per year'}
                buttonText="Select Plan"
                paymentLink="/checkout" // Example link, modify based on your logic
              />
            </Grid>
          ))
        ) : (
          <p>No plans available</p>
        )}
      </Grid>
    </div>
  );
}
