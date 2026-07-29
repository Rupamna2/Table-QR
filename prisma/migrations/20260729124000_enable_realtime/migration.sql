-- Enable replication for the Order table in Supabase Realtime
-- Creating the publication if it doesn't exist, and adding the Order table to it.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE "Order";
