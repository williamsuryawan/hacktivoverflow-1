<template>
    <div class="footer-classic context-dark bg-image" >
        <div class="container col-sm-12">
                <div class="row row-30">
                    <div class="col-md-4 col-xl-5">
                        <div class="pr-xl-4"><a class="brand" href="index.html">
                                <center><img class="brand-logo-light"
                                        src="../assets/hlogo.png"
                                        alt="" height="100"></center>
                            </a>
                            <p>We are learning front end now. Please contact us if you want to learn what we are
                                learning now. Free material is available for limited period of time.</p>
                            <!-- Rights-->
                            <p class="rights"><span>©  </span><span
                                    class="copyright-year">2019</span><span> </span><span>William</span><span>. </span><span>All
                                    Rights Reserved.</span></p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <h5>Contacts</h5>
                        <dl class="contact-list">
                            <dt>Address:</dt>
                            <dd>Jalan Arteri Pondok Indah</dd>
                        </dl>
                        <dl class="contact-list">
                            <dt>email:</dt>
                            <dd><a href="mailto:#">suryawan.william@gmail.com</a></dd>
                        </dl>
                        <dl class="contact-list">
                            <dt>phones:</dt>
                            <dd><a href="tel:#">+62 811859575</a></dd>
                        </dl>
                    </div>
                    <div class="col-md-4 col-xl-3">
                        <h5>Links</h5>
                        <ul class="nav-list">
                            <li><router-link to="/" style="color:black"> Home </router-link></li>
                            <li><router-link to="/questions" style="color:black"> All Questions</router-link></li>
                            <li><router-link to="/myprofile" style="color:black"> My Profile</router-link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="row no-gutters social-container" style="text-align: center;" >
                <div class="col"><a class="social-inner" href="https://www.facebook.com/williamsuryawan" target="_blank" style="color:black"><i class="fab fa-facebook-square"></i>  <span>Facebook</span></a></div>
                <div class="col"><a class="social-inner" href="https://www.linkedin.com/in/williamsuryawan/" target="_blank" style="color:black"><i class="fab fa-linkedin"></i><span>LinkedIn</span></a></div>
                <div class="col"><a class="social-inner" href="https://twitter.com/williamsuryawan" target="_blank" style="color:black"><i class="fab fa-twitter-square"></i><span>Twitter</span></a></div>
                <div class="col"><a class="social-inner" href="https://www.instagram.com/williamsuryawan" target="_blank" style="color:black"><i class="fab fa-instagram"></i><span>Instagram</span></a></div>
            </div>	
    </div>
</template>

<script>
export default {
  name: 'footbar',
};
</script>

<style scoped>
h1 {
    z-index: 3;
}
</style>
