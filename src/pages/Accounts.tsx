import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, CircularProgress } from '@mui/material';
import ProfileCard from '../components/profile/ProfileCard';
import { Account } from '../types';
import { getAllAccounts, getCurrentAccount } from '../services/accountService';

const Accounts: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const [accountsData, currentAccountData] = await Promise.all([
          getAllAccounts(),
          getCurrentAccount(),
        ]);
        setAccounts(accountsData);
        setCurrentAccount(currentAccountData);
      } catch (error) {
        console.error('Hesaplar yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Kullanıcılar
      </Typography>
      <Grid container spacing={3}>
        {accounts.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account.accountId}>
            <ProfileCard
              account={account}
              isOwnProfile={currentAccount?.accountId === account.accountId}
              onEdit={() => navigate(`/profile/${account.accountId}`)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Accounts; 