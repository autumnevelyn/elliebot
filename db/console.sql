--USEFUL:
    -- range @> point : includes
    -- lower(range) and upper(range) for the bounds of a range
    -- to be able to express the PK in the exclusion constraint using gist, we can convert them to intervals of bigint [id,id] and [guild,guild]
    -- RAISE NOTICE 'i want to print % and %', var1,var2;

    --Gives you the user that last changed their name:
        -- select *
        -- from member
        -- where id_member = (
        --     select id_member
        --     from member_log , (
        --         select max(upper(valid_at)) as val
        --         from member_log
        --     ) as max
        --     where upper(valid_at)=max.val);

-- create Warning type table and fill
create table Warning_Type
(
    id_warning_type   INTEGER     not null
        primary key,
    name_warning_type varchar(50) not null
);
insert into Warning_Type(id_warning_type, name_warning_type)
VALUES (1, 'minor'),
       (2, 'medium'),
       (3, 'severe');

-- create User table
create table Member
(
    id_member    char(18)    not null,
    guild        char(18)    not null,
    username     varchar(50) not null,
    display_name varchar(50) not null,
    valid_from   timestamp,
    primary key (id_member, guild)
);

-- create User history table: logs of username and/or display-name changes
create table Member_log
(
    id_member    char(18)    not null,
    guild        char(18)    not null,
    username     varchar(50) not null,
    display_name varchar(50) not null,
    valid_at     tsrange     not null,
    primary key (id_member, guild, valid_at),
    -- in order for the primary keys to work with gist we need to convert them to a range "id_member WITH =" ==> "int8range(id_member::bigint,id_member::bigint,'[]') WITH ="
    exclude using gist (int8range(id_member::bigint, id_member::bigint, '[]') WITH =,int8range(guild::bigint, guild::bigint, '[]') WITH =,valid_at WITH &&)
);

create table Warning
(
    id_warning       SERIAL    not null,
    type             INTEGER   not null references Warning_Type,
    reason           TEXT,
    target           char(18)  not null,
    author           char(18)  not null,
    guild            char(18)  not null,
    channel          char(18)  not null,
    date_time        timestamp,
    primary key (id_warning),
    foreign key (target, guild) references member on update cascade on delete restrict,
    foreign key (author, guild) references member on update cascade on delete restrict
);

create table Warning_log
(
    id_warning       INTEGER    not null,
    type             INTEGER   not null references Warning_Type,
    reason           TEXT,
    target           char(18)  not null,
    author           char(18)  not null,
    guild            char(18)  not null,
    channel          char(18)  not null,
    date_time        timestamp,
    delete_date_time timestamp,
    primary key (id_warning),
    foreign key (target, guild) references member on update cascade on delete restrict,
    foreign key (author, guild) references member on update cascade on delete restrict
);

-- TRIGGERS

-- member update (log old record to member_log)
create or replace function proc_member_update() returns trigger as
$$
begin
    insert into member_log(id_member, guild, username, display_name, valid_at)
    values (old.id_member, old.guild, old.username, old.display_name, tsrange(old.valid_from, localtimestamp));
    new.valid_from = localtimestamp;
    return new;
end;
$$ LANGUAGE plpgsql;
create trigger member_update
    before update of username,display_name
    on member
    for each row
    when ( old.username is distinct from new.username OR old.display_name is distinct from new.display_name)
execute procedure proc_member_update();


-- member insert (auto-timestamp)
create or replace function proc_member_insert() returns trigger as
$$
begin
    new.valid_from = localtimestamp;
    return new;
end;
$$ LANGUAGE plpgsql;
create trigger member_insert
    before insert
    on member
    for each row
execute procedure proc_member_insert();

-- warning insert (auto-timestamp)
create or replace function proc_warn_insert() returns trigger as
$$
begin
    new.date_time = localtimestamp;
    return new;
end;
$$ LANGUAGE plpgsql;
create trigger warning_insert
    before insert
    on warning
    for each row
execute procedure proc_warn_insert();

-- warning delete (archive the old warning)
create or replace function proc_warn_delete() returns trigger as
$$
begin
    insert into Warning_log(id_warning,type, reason, target, author, guild, channel, date_time, delete_date_time)
    values (old.id_warning,old.type, old.reason, old.target, old.author,old.guild, old.channel, old.date_time, localtimestamp);
    return null;
end;
$$ LANGUAGE plpgsql;
create trigger warning_delete
    after delete
    on warning
    for each row
execute procedure proc_warn_delete();

-- TESTS:
-- insert into Member(id_member, guild, username, display_name)
-- values ('123', '321', 'user1', 'user1'),
--        ('123', '654', 'user1', 'user1'),
--        ('456', '321', 'user2', 'user2');
-- insert into Member(id_member, guild, username, display_name, valid_from)
-- values ('123', '321', 'user1', 'user1');
-- update Member
-- set display_name = 'user1_update1'
-- where id_member = '123'
--   and guild = '321';
-- update Member
-- set display_name = 'user1_update2'
-- where id_member = '123'
--   and guild = '321';
-- update Member
-- set display_name = 'user1_update3'
-- where id_member = '123'
--   and guild = '321';
