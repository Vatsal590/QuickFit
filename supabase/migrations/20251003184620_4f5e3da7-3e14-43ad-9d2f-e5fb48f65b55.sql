-- Allow users to view referrals where they are either the referrer OR the referred user
DROP POLICY IF EXISTS "Users can view their own referrals" ON referrals;

CREATE POLICY "Users can view referrals as referrer or referred"
ON referrals
FOR SELECT
USING (auth.uid() = referrer_id OR auth.uid() = referred_id);