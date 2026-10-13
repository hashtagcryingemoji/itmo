    .data
input_addr:      .word  0x80
output_addr:     .word  0x84

    .text
    .org 0x88
_start:
    @p input_addr a! @ 

    blte

    @p output_addr a! !
    halt

blte:
    3 >r

get_byte:
    bitmask
    lshift_8
    next get_byte

    3 >r
build_reverse:
    lshift_8 or 
    next build_reverse
    ;

swap: \ swap(T,S)
    over >r >r drop r> r>
    ;

bitmask: 
    dup
    23 >r
    0xFF000000 and
do_bitmask:
    2/
    next do_bitmask
    0x000000FF and
    swap
    ;

lshift_8:
    7 >r
do_shift:
    2*
    next do_shift
    ;

or:
    dup >r
    swap dup
    r> and
    a!
    xor a
    xor
    ;

