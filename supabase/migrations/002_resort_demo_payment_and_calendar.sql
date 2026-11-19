-- Demo checkout metadata and safe public availability calendar.
alter table public.bookings
  add column if not exists payment_method text not null default 'pay_at_property',
  add column if not exists payment_status text not null default 'pending',
  add column if not exists payment_reference text;
alter table public.bookings alter column payment_status set default 'pending';
alter table public.bookings drop constraint if exists bookings_payment_method_check,
  add constraint bookings_payment_method_check check(payment_method in ('upi_demo','card_demo','pay_at_property'));
alter table public.bookings drop constraint if exists bookings_payment_status_check,
  add constraint bookings_payment_status_check check(payment_status in ('pending','paid_demo','failed_demo','due_at_property'));

create or replace function public.complete_demo_payment(p_booking_reference text,p_payment_method text,p_simulate_success boolean)
returns table(booking_reference text,booking_status public.booking_status,payment_status text,payment_method text)
language plpgsql security definer set search_path=public as $$
declare v_booking public.bookings%rowtype; v_payment_status text; v_booking_status public.booking_status;
begin
  if p_payment_method not in ('upi_demo','card_demo','pay_at_property') then raise exception 'Unsupported demo payment method'; end if;
  select * into v_booking from public.bookings where public.bookings.booking_reference=p_booking_reference for update;
  if not found then raise exception 'Booking not found'; end if;
  if v_booking.payment_status in ('paid_demo','due_at_property','failed_demo') then raise exception 'This booking has already completed checkout'; end if;
  if p_payment_method='pay_at_property' then v_payment_status:='due_at_property';v_booking_status:='confirmed';
  elsif p_simulate_success then v_payment_status:='paid_demo';v_booking_status:='confirmed';
  else v_payment_status:='failed_demo';v_booking_status:='cancelled'; end if;
  update public.bookings set payment_method=p_payment_method,payment_status=v_payment_status,
    payment_reference=case when v_payment_status='paid_demo' then 'DEMO-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,10)) else null end,
    status=v_booking_status where id=v_booking.id;
  return query select v_booking.booking_reference,v_booking_status,v_payment_status,p_payment_method;
end;$$;
revoke all on function public.complete_demo_payment(text,text,boolean) from public;
grant execute on function public.complete_demo_payment(text,text,boolean) to anon,authenticated;

create or replace function public.get_public_booking_calendar()
returns table(room_id text,check_in date,check_out date)
language sql stable security definer set search_path=public as $$
  select b.room_id,b.check_in,b.check_out from public.bookings b
  where b.status in ('pending','confirmed') and b.check_out>current_date
$$;
revoke all on function public.get_public_booking_calendar() from public;
grant execute on function public.get_public_booking_calendar() to anon,authenticated;
revoke insert on public.bookings from anon,authenticated;
