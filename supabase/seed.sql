insert into public.regions (name, latitude, longitude) values
  ('Dakar', 14.7167, -17.4677),
  ('Diourbel', 14.6533, -16.2333),
  ('Fatick', 14.3333, -16.4167),
  ('Kaffrine', 14.1167, -15.5500),
  ('Kaolack', 14.1517, -16.0728),
  ('Kédougou', 12.5600, -12.1750),
  ('Kolda', 12.8833, -14.9500),
  ('Louga', 15.6167, -16.2167),
  ('Matam', 15.6558, -13.2583),
  ('Saint-Louis', 16.0212, -16.4896),
  ('Sédhiou', 12.7081, -15.5569),
  ('Tambacounda', 13.7580, -13.7580),
  ('Thiès', 14.7833, -16.9333),
  ('Ziguinchor', 12.5600, -16.2700)
on conflict (name) do update set
  latitude = excluded.latitude,
  longitude = excluded.longitude;

insert into public.companies (name)
select name
from (values ('Sunu Transport'), ('Teranga Voyage')) as companies(name)
where not exists (
  select 1 from public.companies existing where existing.name = companies.name
);

insert into public.trips (
  company_id,
  departure_region_id,
  arrival_region_id,
  departure_time,
  duration,
  price,
  total_seats
)
select
  companies.id,
  departure_region.id,
  arrival_region.id,
  trips.departure_time::timestamptz,
  trips.duration,
  trips.price,
  20
from (values
  ('Sunu Transport', 'Dakar', 'Thiès', '2026-09-18 08:00:00+00', 90, 2500),
  ('Sunu Transport', 'Dakar', 'Saint-Louis', '2026-09-18 09:30:00+00', 240, 6000),
  ('Teranga Voyage', 'Thiès', 'Dakar', '2026-09-18 14:00:00+00', 90, 2500),
  ('Teranga Voyage', 'Dakar', 'Ziguinchor', '2026-09-19 07:00:00+00', 420, 10000)
) as trips(company_name, departure_name, arrival_name, departure_time, duration, price)
join public.companies on companies.name = trips.company_name
join public.regions departure_region on departure_region.name = trips.departure_name
join public.regions arrival_region on arrival_region.name = trips.arrival_name
where not exists (
  select 1
  from public.trips existing
  where existing.company_id = companies.id
    and existing.departure_region_id = departure_region.id
    and existing.arrival_region_id = arrival_region.id
    and existing.departure_time = trips.departure_time::timestamptz
);

insert into public.seats (trip_id, seat_number)
select trips.id, numbers.seat_number
from public.trips
cross join generate_series(1, 20) as numbers(seat_number)
where not exists (
  select 1 from public.seats existing where existing.trip_id = trips.id
);

insert into public.trips (
  company_id,
  departure_region_id,
  arrival_region_id,
  departure_time,
  duration,
  price,
  total_seats
)
select
  companies.id,
  departure_region.id,
  arrival_region.id,
  '2026-09-20 08:00:00+00'::timestamptz,
  180,
  5000,
  20
from public.companies
join public.regions departure_region on departure_region.name = 'Dakar'
join public.regions arrival_region on arrival_region.name <> 'Dakar'
where companies.name = 'Sunu Transport'
  and not exists (
    select 1
    from public.trips existing
    where existing.company_id = companies.id
      and existing.departure_region_id = departure_region.id
      and existing.arrival_region_id = arrival_region.id
  );

insert into public.seats (trip_id, seat_number)
select trips.id, numbers.seat_number
from public.trips
cross join generate_series(1, 20) as numbers(seat_number)
where trips.departure_time = '2026-09-20 08:00:00+00'::timestamptz
  and not exists (
    select 1 from public.seats existing where existing.trip_id = trips.id
  );
