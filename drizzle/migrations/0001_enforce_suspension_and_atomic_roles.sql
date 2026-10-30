CREATE POLICY "Active accounts only" ON public.cart_items AS RESTRICTIVE FOR ALL TO authenticated USING(public.is_account_active()) WITH CHECK(public.is_account_active());
CREATE POLICY "Active accounts only" ON public.favorites AS RESTRICTIVE FOR ALL TO authenticated USING(public.is_account_active()) WITH CHECK(public.is_account_active());
CREATE POLICY "Active accounts only" ON public.profiles AS RESTRICTIVE FOR ALL TO authenticated USING(public.is_account_active()) WITH CHECK(public.is_account_active());
CREATE POLICY "Active admin accounts only" ON public.user_roles AS RESTRICTIVE FOR ALL TO authenticated USING(public.is_account_active()) WITH CHECK(public.is_account_active());
CREATE POLICY "Active product admins" ON public.products AS RESTRICTIVE FOR UPDATE TO authenticated USING(public.is_account_active()) WITH CHECK(public.is_account_active());
CREATE POLICY "Active product admins insert" ON public.products AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK(public.is_account_active());
CREATE POLICY "Active product admins delete" ON public.products AS RESTRICTIVE FOR DELETE TO authenticated USING(public.is_account_active());
CREATE POLICY "Active settings admins" ON public.site_settings AS RESTRICTIVE FOR UPDATE TO authenticated USING(public.is_account_active()) WITH CHECK(public.is_account_active());
CREATE FUNCTION public.set_customer_role(_target uuid,_role text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
IF NOT public.is_account_active() OR NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
IF _role NOT IN ('admin','staff','customer') OR (auth.uid()=_target AND _role<>'admin') THEN RAISE EXCEPTION 'Invalid role change'; END IF;
DELETE FROM public.user_roles WHERE user_id=_target;
IF _role<>'customer' THEN INSERT INTO public.user_roles(user_id,role) VALUES(_target,_role::public.app_role); END IF;
END $$;
REVOKE ALL ON FUNCTION public.set_customer_role(uuid,text) FROM PUBLIC,anon; GRANT EXECUTE ON FUNCTION public.set_customer_role(uuid,text) TO authenticated;